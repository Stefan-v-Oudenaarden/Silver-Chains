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

import { RandomNumbersLink } from 'src/SilverLinks/Generation/RandomNumbersLin';
import { ReverseLinesLink, ReverseTextLink } from 'src/SilverLinks/Sorting/ReverseTextLinks';
import { RandomizeLinesLink, RandomizeTextLink } from 'src/SilverLinks/Sorting/RandomizeTextLinks';
import { AddLineNumbersLink, RemoveLineNumbersLink } from 'src/SilverLinks/Transformation/LineNumbersLink';
import { PadLineLink } from 'src/SilverLinks/Transformation/PadLineLink';
import { ExtractNumbersLink } from 'src/SilverLinks/Extraction/ExtractNumbersLink';
import { ExtractEmailsLink } from 'src/SilverLinks/Extraction/ExtractEmailsLink';
import { ExtractDatesLink } from 'src/SilverLinks/Extraction/ExtractDatesLink';
import { UniqueLinesLink } from 'src/SilverLinks/Extraction/UniqueLinesLink';
import { UniqueWordsLink } from 'src/SilverLinks/Extraction/UniqueWordsLink';
import { AlphabetizeLinesLink } from 'src/SilverLinks/Sorting/AphabetizeLinesLink';
import { WordFrequencyLink } from 'src/SilverLinks/Analysis/WordFrequencyLink';
import { RemoveWhiteSpaceLink } from 'src/SilverLinks/Transformation/RemoveWhiteSpaceLink';
import { RemoveInterpunctionLink } from 'src/SilverLinks/Transformation/RemoveInterpunctionLink';
import { SwapCaseLink } from 'src/SilverLinks/Transformation/SwapCaseLink';

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
    new WordFrequencyLink(),

    //Generation
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

    //Extraction
    new ExtractNumbersLink(),
    new ExtractEmailsLink(),
    new ExtractDatesLink(),
    new UniqueLinesLink(),
    new UniqueWordsLink(),

    //Sorting
    new ReverseTextLink(),
    new ReverseLinesLink(),
    new RandomizeTextLink(),
    new RandomizeLinesLink(),
    new AlphabetizeLinesLink(),

    //Transformation
    new PadLineLink(),
    new TrimTextLink(),
    new RemoveWhiteSpaceLink(),
    new RemoveInterpunctionLink(),
    new AddLineNumbersLink(),
    new RemoveLineNumbersLink(),

    //Cases
    new ToUpperCaseLink(),
    new ToLowerCaseLink(),
    new SwapCaseLink(),
  ];

  constructor() {
    let lorem = new LorempIpsumLink();
    lorem.Settings.Static = true;

    // this.DevLinks = [lorem, new RandomizeLinesLink(), new ToLowerCaseLink()];
    this.DevLinks = [lorem];
  }
}
