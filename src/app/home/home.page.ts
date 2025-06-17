import { Component, computed, inject, isDevMode, signal } from '@angular/core';
import { SplitAreaComponent, SplitComponent } from 'angular-split';
import { CdkDragDrop, moveItemInArray, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { LinksService, SilverLink, SilverLinkData } from 'src/services/links.service';
import { LinkChainService, SavedLinkChainLink } from 'src/services/linkchain.service';
import { InputPanelComponent } from '../../components/panels/input-panel/input-panel.component';
import { OutputPanelComponent } from '../../components/panels/output-panel/output-panel.component';
import { LinkItemComponent } from '../../components/links/link-item/link-item.component';
import { trashSharp, chevronDownSharp, chevronUpSharp, sendSharp, pushOutline } from 'ionicons/icons';
import { IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonButton, IonButtons, IonIcon, IonSearchbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
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
  ],
})
export class HomePage {
  private LinksService = inject(LinksService);
  private LinkChainService = inject(LinkChainService);
  private route = inject(ActivatedRoute);
  private TitleService = inject(Title);

  private urlData$ = this.route.params.pipe(
    map((params) => params['data']),
    takeUntilDestroyed()
  );

  public UserInput = signal<SilverLinkData>(new SilverLinkData(''));
  public InputValue = signal<string | undefined>(undefined);
  public SilverChainOutput = signal<SilverLinkData>(new SilverLinkData(''));
  public AllChainLinksSettingsShow = signal<boolean>(false);
  public LinkSearchString = signal<string | undefined>(undefined);

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
    ['Transformation', true],
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
    // this.LinkChain().push(new TextAnalysisLink());
    // this.RunSilverLinkChain();

    addIcons({ trashSharp, chevronDownSharp, chevronUpSharp, sendSharp });

    // if (isDevMode()) {
    //   for (let link of this.LinksService.DevLinks) {
    //     this.LinkChain().push(link);
    //   }
    // }

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

  async UpdateUrl() {
    let base64Data = btoa(this.LinkChainService.ExportChain());

    if (this.LinkChain().length > 0) {
      history.pushState({ data: base64Data }, '', `/${base64Data}`);
    } else {
      history.pushState({ data: base64Data }, '', `/`);
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
    const output = this.LinkChainService.ProcessInput(input);

    this.SilverChainOutput.set(output);
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
