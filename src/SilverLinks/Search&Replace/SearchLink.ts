import { inject, signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink, SilverLinkTextElement } from 'src/services/links.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { ComplexSilverLink } from '../ComplexSilverLink';

export class SearchLink extends ComplexSilverLink {
  public DomSanitizer: DomSanitizer;

  override Name = 'Find';
  override Category = 'Find and Replace';
  override Description = `Find a given text in the input and display the results.`;

  override HasSettings = true;
  override ShowSettings = signal<boolean>(true);

  override Settings: {
    FindString: string;
    DisplayType: string;
    IgnoreCase: boolean;
    MultiLine: boolean;
  } = {
    FindString: '',
    DisplayType: 'highlights',
    IgnoreCase: true,
    MultiLine: false,
  };

  override SettingsForm: FormlyFieldConfig[] = [
    {
      key: 'FindString',
      type: 'string',
      defaultValue: '',
      props: {
        label: 'Find',
        required: false,
      },
    },
    {
      key: 'IgnoreCase',
      type: 'checkbox',
      defaultValue: true,
      props: {
        label: 'Case Sensitive?',
        required: false,
      },
    },
  ];

  constructor(domSanitizer: DomSanitizer) {
    super();
    this.DomSanitizer = domSanitizer;
  }

  public override PerEntryOperation(entry: SilverLinkTextElement): SilverLinkTextElement {
    let output: SilverLinkTextElement = {};
    const Text = entry.Text;

    if (this.Settings.FindString === undefined || this.Settings.FindString.length === 0 || Text === undefined || Text.length === 0) {
      output.Text = Text;
      return output;
    }

    if (this.Settings.IgnoreCase) {
      output.HTML = this.ConvertSafeHtml(this.BuildHtmlHighlight(this.Settings.FindString, Text));
    } else {
      const findRegex = this.Settings.FindString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(findRegex, 'gi');
      output.HTML = this.ConvertSafeHtml(this.BuildHtmlHighlight(regex, Text));
    }

    output.Text = Text;
    output.HideTextField = true;

    return output;
  }

  private BuildHtmlHighlight(search: RegExp | string, text: string): string {
    let highLightCount = 1;

    let replacementList: { token: string; replacement: string }[] = [];

    let highlightText = text.replaceAll(search, (substring: string, ...args: any[]) => {
      let groups = args
        .slice(0, -2)
        .map((g, index) => {
          return `${index}: ${g}`;
        })
        .join('. \n');

      const highlightVariant = highLightCount % 4;
      highLightCount++;

      const token = `{[($${highLightCount})]}`;
      const replacement = `<span class="highlight-${highlightVariant}" title="${groups}">${substring}</span>`;

      replacementList.push({ token: token, replacement: replacement });

      return token;
    });

    const paragraphs = highlightText.split('\n\n').map((p) => {
      return `<p>${p}</p>`;
    });

    let finalHtml = paragraphs.join('').replaceAll('\n', '<br />');

    for (const replacement of replacementList) {
      finalHtml = finalHtml.replace(replacement.token, replacement.replacement);
    }

    return finalHtml;
  }

  public ConvertSafeHtml(htmlString: string): SafeHtml {
    return this.DomSanitizer.bypassSecurityTrustHtml(htmlString);
  }

  public override New(): SilverLink {
    return new SearchLink(this.DomSanitizer);
  }
}
