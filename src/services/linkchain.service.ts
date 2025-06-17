import { inject, Injectable, signal } from '@angular/core';
import { LinksService, SilverLink, SilverLinkData } from './links.service';

export interface SavedLinkChainLink {
  name: string;
  settings?: any;
}

@Injectable({
  providedIn: 'root',
})
export class LinkChainService {
  public LinkChain = signal<SilverLink[]>([]);

  private LinksService = inject(LinksService);

  constructor() {}

  public ProcessInput(Input: SilverLinkData): SilverLinkData {
    let output = Input;

    if (this.LinkChain().length === 0) {
      return Input;
    }

    for (let silverLink of this.LinkChain()) {
      if (!silverLink.Disabled()) {
        output = silverLink.Run(output);
      }
    }

    return output;
  }

  public ChainTitle(): string {
    return this.LinkChain()
      .map((l) => {
        return l.Name;
      })
      .join(', ');
  }

  public ExportChain(): string {
    let r = this.LinkChain().map((l) => {
      let o: SavedLinkChainLink = { name: l.Name };
      if (l.HasSettings) {
        o.settings = l.Settings;
      }
      return o;
    });

    return JSON.stringify(r);
  }

  public ImportChain(ImportData: SavedLinkChainLink[] | string) {
    let LinkChain: SavedLinkChainLink[] = [];
    if (typeof ImportData === 'string') {
      LinkChain = JSON.parse(ImportData);
    } else if (typeof ImportData === 'string') {
      LinkChain = ImportData;
    } else {
      return;
    }

    const knownLinks = this.LinksService.Links;
    const LoadedLinkChain: SilverLink[] = [];

    for (const SavedLink of LinkChain) {
      const link = knownLinks.find((l) => {
        return l.Name === SavedLink.name;
      });

      if (link === undefined) {
        return;
      }

      let newLink = link.New();
      if (SavedLink.settings !== undefined) {
        newLink.LoadSettings(SavedLink.settings);
      }

      LoadedLinkChain.push(newLink);
    }

    if (LoadedLinkChain.length > 0) {
      this.LinkChain.set(LoadedLinkChain);
    }
  }
}
