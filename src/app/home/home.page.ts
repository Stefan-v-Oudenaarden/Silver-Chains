import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, computed, inject, isDevMode, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonSearchbar,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { SplitAreaComponent, SplitComponent } from 'angular-split';
import { addIcons } from 'ionicons';
import { chevronDownSharp, chevronUpSharp, closeCircleSharp, saveSharp, sendSharp, trashSharp } from 'ionicons/icons';
import { debounce, debounceTime, distinctUntilChanged, interval, map, Observable, switchMap, timer } from 'rxjs';
import { SaveChainComponent } from 'src/components/panels/save-chain/save-chain.component';
import { LinkChainService } from 'src/services/linkchain.service';
import { LinksService, SilverLink, SilverLinkData } from 'src/services/links.service';

import { LinkItemComponent } from '../../components/links/link-item/link-item.component';
import { InputPanelComponent } from '../../components/panels/input-panel/input-panel.component';
import { OutputPanelComponent } from '../../components/panels/output-panel/output-panel.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonToolbar,
    IonTitle,
    IonHeader,
    IonContent,
    IonModal,
    IonSearchbar,
    IonIcon,
    IonButtons,
    IonButton,
    IonLabel,
    IonItem,
    IonAccordionGroup,
    IonAccordion,
    SplitComponent,
    SplitAreaComponent,
    CdkDropList,
    CdkDrag,
    InputPanelComponent,
    OutputPanelComponent,
    LinkItemComponent,
    FormsModule,
    SaveChainComponent,
  ],
})
export class HomePage {
  private LinksService = inject(LinksService);
  private LinkChainService = inject(LinkChainService);
  private route = inject(ActivatedRoute);
  private TitleService = inject(Title);

  private urlData$ = this.route.queryParams.pipe(
    map((params) => {
      return params['Chain'];
    }),
    takeUntilDestroyed()
  );

  public UserInput = signal<SilverLinkData>(new SilverLinkData(''));
  public InputValue = signal<string | undefined>(undefined);
  public AllChainLinksSettingsShow = signal<boolean>(false);
  public LinkSearchString = signal<string | undefined>(undefined);
  public isSaveChainModalOpen = signal<boolean>(false);

  public SilverChainOutputTriggers = signal<{ input: SilverLinkData; id: string }>({ input: new SilverLinkData(''), id: 'startingValue' });
  public SilverChainOutput$ = toObservable(this.SilverChainOutputTriggers).pipe(
    debounceTime(50),
    distinctUntilChanged(),
    switchMap((outputTrigger) => {
      return new Observable<SilverLinkData>((sub) => {
        const output = this.LinkChainService.ProcessInput(outputTrigger.input);
        sub.next(output);
        sub.complete();
      });
    })
  );

  public SilverChainOutput = toSignal(this.SilverChainOutput$);

  public SearchResult = computed(() => {
    let searchString = this.LinkSearchString();

    if (searchString) {
      return this.Links.filter(
        (link) =>
          link.Name.toLocaleLowerCase().includes(searchString.toLocaleLowerCase()) ||
          link.Searchterms.toLocaleLowerCase().includes(searchString.toLocaleLowerCase())
      );
    }

    return [];
  });

  public LinkChain = this.LinkChainService.LinkChain;
  public Links = this.LinksService.Links;

  public CategoriesDefaultState: Map<string, boolean> = new Map<string, boolean>([
    ['Generation', false],
    ['Find and Replace', true],
    ['Extraction', false],
    ['Sorting', false],
    ['Transformation', false],
    ['Cases', false],
    ['Cypher', true],
    ['Splitting & Joining', false],
    ['Output', false],
  ]);

  public LinkCategories = computed(() => {
    let staticSet = new Set(this.CategoriesDefaultState.keys());
    let liveset = new Set(this.Links.map((link) => link.Category));
    return new Set([...staticSet, ...liveset]);
  });

  public LinksByCategory = computed(() => {
    let linksByCategory = new Map<string, SilverLink[]>();
    for (const category of this.LinkCategories()) {
      const links = this.Links.filter((link) => link.Category === category);
      linksByCategory.set(category, links);
    }

    return linksByCategory;
  });

  constructor() {
    addIcons({ trashSharp, chevronDownSharp, chevronUpSharp, sendSharp, saveSharp, closeCircleSharp });

    if (isDevMode()) {
      for (let link of this.LinksService.DevLinks) {
        this.LinkChain().push(link);
      }
    }

    this.urlData$.subscribe((data) => {
      if (!data) {
        return;
      }

      try {
        var decodedData = atob(data);
      } catch (e: any) {
        console.warn(e, data);
        return;
      }

      if (decodedData) {
        this.LinkChainService.ImportChain(decodedData);
      }
    });
  }

  SaveChain() {
    this.isSaveChainModalOpen.set(true);
  }

  async UpdateUrl() {
    let base64Data = btoa(this.LinkChainService.ExportChain());

    //Because this is running as a github pages page our root is / normally but /project-name/ on github.
    //the GH-Pages package automatically injects the project name in index.html in a <base> tag
    //so we fetch it and use it here.
    let urlBase = document.getElementsByTagName('base')[0].getAttribute('href');

    if (!urlBase) {
      urlBase = '/';
    }

    //Due to the fact this is meant to run as a github pages page we cannot use normal routing strategies to load data from the url
    //So we save and load it through a bare query param on the root.
    if (this.LinkChain().length > 0) {
      history.pushState({ data: base64Data }, '', `${urlBase}?Chain=${base64Data}`);
    } else {
      history.pushState({ data: base64Data }, '', `${urlBase}`);
    }
  }

  async UpdatePageTitle() {
    let newTitle = this.LinkChainService.ChainTitle();
    if (this.LinkChain().length > 0) {
      this.TitleService.setTitle(`Silver Chains - ${newTitle}`);
    } else {
      this.TitleService.setTitle(`Silver Chains`);
    }
  }

  RunSilverLinkChain() {
    const input = this.UserInput();

    this.SilverChainOutputTriggers.set({ input: input, id: uuidv4() });
    this.UpdateUrl();
    this.UpdatePageTitle();
  }

  EmptyLinkChain() {
    this.LinkChain.set([]);
    this.RunSilverLinkChain();
  }

  ToggleShowHideAllLinkSettings() {
    let currentChain = this.LinkChain();
    let isShown = this.AllChainLinksSettingsShow();

    for (let link of currentChain) {
      link.ShowSettings.set(!isShown);
    }

    this.AllChainLinksSettingsShow.set(!isShown);
  }

  OnLinkItemDoubleClick(event: any, link: SilverLink) {
    let currentChain = this.LinkChain();
    currentChain.push(link.New());
    this.LinkChain.set(currentChain);
  }

  OnChainLinkTrash(link: SilverLink) {
    let currentChain = this.LinkChain();
    currentChain = currentChain.filter((item) => {
      return item !== link;
    });
    this.LinkChain.set(currentChain);
    this.RunSilverLinkChain();
  }

  OnUserInput(input: SilverLinkData) {
    this.UserInput.set(input);
    this.RunSilverLinkChain();
  }

  CopyOutputToInput(output: string) {
    this.InputValue.set(output);
  }

  drop(event: CdkDragDrop<SilverLink[]>) {
    const targetPanel = event.container.id;
    const originPanel = event.previousContainer.id;

    if (targetPanel === originPanel && targetPanel === 'chain-panel') {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if (targetPanel === 'chain-panel') {
      let linkChain = this.LinkChain();
      let newItem = event.item.data.New();
      linkChain.splice(event.currentIndex, 0, newItem);
      this.LinkChain.set(linkChain);
    } else if (targetPanel !== originPanel && targetPanel === 'links-panel') {
      let linkChain = this.LinkChain();
      linkChain = linkChain.filter((item) => {
        return item !== event.item.data;
      });

      this.LinkChain.set(linkChain);
    }

    this.RunSilverLinkChain();
  }
}
