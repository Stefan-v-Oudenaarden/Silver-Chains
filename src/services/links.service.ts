import { Injectable, Signal, WritableSignal } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { ToLowerCaseLink, ToUpperCaseLink, TrimTextLink } from 'src/SilverLinks/SimpleTextEdits';
import { BeeMovieLink } from 'src/SilverLinks/StaticTextLinks';

export interface SilverLink {
  Name: string;
  Description: string;
  Category: string;
  Id: string;

  Error: WritableSignal<boolean>;
  Output: WritableSignal<string>;
  Disabled: WritableSignal<boolean>;

  HasSettings: boolean;
  ShowSettings: WritableSignal<boolean>;

  Settings?: any;
  SettingsForm?: FormlyFieldConfig[];
  SettingsFormOptions?: FormlyFormOptions;

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
