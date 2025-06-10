import { Injectable, Signal, WritableSignal } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { ToLowerCaseLink, ToUpperCaseLink, TrimTextLink } from 'src/SilverLinks/SimpleTextEdits';
import { JoinTextLink, SplitTextLink } from 'src/SilverLinks/SplittingJoining';
import { BeeMovieLink } from 'src/SilverLinks/StaticTextLinks';

export type SilverLinkTextElement = {
  Text?: string;
  Information?: string;
};

export class SilverLinkData {
  public TextData: SilverLinkTextElement[];

  constructor(input: string | undefined = undefined) {
    if (input === undefined) {
      this.TextData = [];
      return;
    } else {
      this.TextData = [{ Text: input }];
    }
  }
}

export interface SilverLink {
  Name: string;
  Description: string;
  Category: string;
  Id: string;

  Error: WritableSignal<boolean>;
  Output: WritableSignal<SilverLinkData>;
  Disabled: WritableSignal<boolean>;

  HasSettings: boolean;
  ShowSettings: WritableSignal<boolean>;

  Settings?: any;
  SettingsForm?: FormlyFieldConfig[];
  SettingsFormOptions?: FormlyFormOptions;

  Run(Input: SilverLinkData): SilverLinkData;
  New(): SilverLink;
}

@Injectable({
  providedIn: 'root',
})
export class LinksService {
  public Links: SilverLink[] = [
    new ToUpperCaseLink(),
    new ToLowerCaseLink(),
    new TrimTextLink(),
    new BeeMovieLink(),
    new SplitTextLink(),
    new JoinTextLink(),
  ];

  constructor() {}
}
