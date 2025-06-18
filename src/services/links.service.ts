import { Injectable, isDevMode, WritableSignal } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

import { SimpleTableData } from 'src/components/simple-table/simple-table.component';

import { AsHtmlLink } from 'src/SilverLinks/Parsing/ASHtmlLink';
import { AsJsonLink } from 'src/SilverLinks/Parsing/AsJsonLink';
import { AsMarkdownLink } from 'src/SilverLinks/Parsing/AsMarkdownLink';
import { JoinTextLink, SplitTextLink } from 'src/SilverLinks/Splitting&Joining/SplittingJoining';
import { ToLowerCaseLink, ToUpperCaseLink, TrimTextLink } from 'src/SilverLinks/Transformation/SimpleTextEdits';
import { LorempIpsumLink } from 'src/SilverLinks/Generation/LoremIpsumLink';
import { TextAnalysisLink } from 'src/SilverLinks/Analysis/TextAnalysisLink';
import { UUIDLink } from 'src/SilverLinks/Generation/UUIDLink';
import { CopyPastaLink } from 'src/SilverLinks/Generation/CopyPastaLink';
import { RandomNumbersLink } from 'src/SilverLinks/Generation/RandomNumbersLin';
import { ReverseLinesLink, ReverseTextLink } from 'src/SilverLinks/Transformation/ReverseTextLinks';
import { RandomizeLinesLink, RandomizeTextLink } from 'src/SilverLinks/Transformation/RandomizeTextLinks';
import { LineNumbersLink } from 'src/SilverLinks/Transformation/LineNumbersLink';
import { PadLineLink } from 'src/SilverLinks/Transformation/PadLineLink';

export type SilverLinkTextElement = {
  Text?: string;
  HideTextField?: boolean;
  Information?: string;
  Image?: string;
  HTMLString?: string;
  Markdown?: string;
  Object?: any;
  Table?: SimpleTableData;
};

export class SilverLinkData {
  public DataFields: SilverLinkTextElement[];

  constructor(input: string | undefined = undefined) {
    if (input === undefined) {
      this.DataFields = [];
      return;
    } else {
      this.DataFields = [{ Text: input }];
    }
  }
}

export interface SilverLink {
  Name: string;
  Searchterms: string;
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
  LoadSettings(Input: any): void;
  New(): SilverLink;
}

@Injectable({
  providedIn: 'root',
})
export class LinksService {
  public DevLinks: SilverLink[] = [];

  public Links: SilverLink[] = [
    //Analysis
    new TextAnalysisLink(),

    //Generation
    // new CopyPastaLink(),
    new LorempIpsumLink(),
    new UUIDLink(),
    new RandomNumbersLink(),

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
    new ReverseTextLink(),
    new ReverseLinesLink(),
    new RandomizeTextLink(),
    new RandomizeLinesLink(),
    new LineNumbersLink(),
    new PadLineLink(),
  ];

  constructor() {
    let lorem = new LorempIpsumLink();
    lorem.Settings.Static = true;

    // this.DevLinks = [lorem, new RandomizeLinesLink(), new ToLowerCaseLink()];
    this.DevLinks = [lorem, new SplitTextLink(), new JoinTextLink()];
  }
}
