import { Component, computed, inject, signal } from '@angular/core';
import { SplitAreaComponent, SplitComponent } from 'angular-split';
import { CdkDragDrop, moveItemInArray, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { LinksService, SilverLink, SilverLinkData } from 'src/services/links.service';
import { LinkChainService } from 'src/services/linkchain.service';
import { InputPanelComponent } from '../../components/panels/input-panel/input-panel.component';
import { OutputPanelComponent } from '../../components/panels/output-panel/output-panel.component';
import { LinkItemComponent } from '../../components/links/link-item/link-item.component';
import { trashSharp, chevronDownSharp, chevronUpSharp } from 'ionicons/icons';
import { IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
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
  ],
})
export class HomePage {
  private LinksService = inject(LinksService);
  private LinkChainService = inject(LinkChainService);

  public UserInput = signal<SilverLinkData>(new SilverLinkData(''));
  public SilverChainOutput = signal<SilverLinkData>(new SilverLinkData(''));
  public AllChainLinksSettingsShow = signal<boolean>(false);

  public LinkChain = this.LinkChainService.LinkChain;
  public Links = this.LinksService.Links;

  public LinkCategories = computed(() => {
    return new Set(this.Links.map((link) => link.Category));
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
    addIcons({ trashSharp, chevronDownSharp, chevronUpSharp });
  }

  RunSilverLinkChain() {
    const input = this.UserInput();
    const output = this.LinkChainService.ProcessInput(input);

    this.SilverChainOutput.set(output);
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
