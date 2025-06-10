import { Component, computed, inject, signal } from '@angular/core';
import { SplitAreaComponent, SplitComponent } from 'angular-split';
import { CdkDragDrop, moveItemInArray, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { LinksService, SilverLink } from 'src/services/links.service';
import { LinkChainService } from 'src/services/linkchain.service';
import { InputPanelComponent } from '../../components/panels/input-panel/input-panel.component';
import { OutputPanelComponent } from '../../components/panels/output-panel/output-panel.component';
import { LinkItemComponent } from '../../components/links/link-item/link-item.component';
import { link } from 'ionicons/icons';
import { IonAccordion, IonAccordionGroup, IonItem, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
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

  public UserInput = signal<string>('');
  public SilverChainOutput = signal<string>('');

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

  constructor() {}

  RunSilverLinkChain() {
    const input = this.UserInput();
    const output = this.LinkChainService.ProcessInput(input);

    this.SilverChainOutput.set(output);
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
  }

  OnUserInput(input: string) {
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
