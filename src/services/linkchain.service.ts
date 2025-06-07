import { Injectable, signal } from '@angular/core';
import { SilverLink } from './links.service';

@Injectable({
  providedIn: 'root',
})
export class LinkChainService {
  public LinkChain = signal<SilverLink[]>([]);

  constructor() {}

  public ProcessInput(Input: string): string {
    let output = Input;
    for (let silverLink of this.LinkChain()) {
      output = silverLink.Parse(output);
    }

    return output;
  }
}
