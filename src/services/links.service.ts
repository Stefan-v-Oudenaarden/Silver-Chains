import { Injectable, isDevMode, Signal, WritableSignal } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { SimpleTableData } from 'src/components/simple-table/simple-table.component';

import { OutputTestLink } from 'src/SilverLinks/Generation/OutputTestLink';
import { BeeMovieLink } from 'src/SilverLinks/Generation/BeeMovieLink';
import { AsHtmlLink } from 'src/SilverLinks/Parsing/ASHtmlLink';
import { AsJsonLink } from 'src/SilverLinks/Parsing/AsJsonLink';
import { AsMarkdownLink } from 'src/SilverLinks/Parsing/AsMarkdownLink';
import { JoinTextLink, SplitTextLink } from 'src/SilverLinks/Splitting&Joining/SplittingJoining';
import { ToLowerCaseLink, ToUpperCaseLink, TrimTextLink } from 'src/SilverLinks/Transformation/SimpleTextEdits';
import { LorempIpsumLink } from 'src/SilverLinks/Generation/LoremIpsumLink';

export type SilverLinkTextElement = {
  Text?: string;
  Information?: string;
  Image?: string;
  HTMLString?: string;
  Markdown?: string;
  Object?: any;
  Table?: SimpleTableData;
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
    //Generation
    new BeeMovieLink(),
    new LorempIpsumLink(),

    //Parsing
    new AsMarkdownLink(),
    new AsJsonLink(),
    new AsHtmlLink(),

    //Splitting & Joining
    new SplitTextLink(),
    new JoinTextLink(),

    //Transformation
    new ToUpperCaseLink(),
    new ToLowerCaseLink(),
    new TrimTextLink(),
  ];

  constructor() {
    if (isDevMode()) {
      this.Links.push(new OutputTestLink());
    }
  }
}
