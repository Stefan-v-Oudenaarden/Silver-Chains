import { Injectable, Signal, WritableSignal } from '@angular/core';
import { ToLowerCaseLink, ToUpperCaseLink, TrimTextLink } from 'src/SilverLinks/SimpleTextEdits';
import { BeeMovieLink } from 'src/SilverLinks/StaticTextLinks';

export interface SilverLink {
  Name: string;
  Description: string;
  Id: string;

  Error: WritableSignal<boolean>;
  Output: WritableSignal<string>;

  Parse(Input: string): string;
  New(): SilverLink;
}

@Injectable({
  providedIn: 'root',
})
export class LinksService {
  public Links: SilverLink[] = [new ToUpperCaseLink(), new ToLowerCaseLink(), new TrimTextLink(), new BeeMovieLink()];

  constructor() {}
}
