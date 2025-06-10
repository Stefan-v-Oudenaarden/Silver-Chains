import { Injectable, signal } from '@angular/core';
import { SilverLink, SilverLinkData } from './links.service';

@Injectable({
  providedIn: 'root',
})
export class LinkChainService {
  public LinkChain = signal<SilverLink[]>([]);

  constructor() {}

  public ProcessInput(Input: SilverLinkData): SilverLinkData {
    let output = Input;
    for (let silverLink of this.LinkChain()) {
      if (!silverLink.Disabled()) {
        output = silverLink.Run(output);
      }
    }

    return output;
  }
}
