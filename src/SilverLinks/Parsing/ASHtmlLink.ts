import { SilverLink, SilverLinkTextElement } from 'src/services/links.service';

import { ComplexSilverLink } from '../ComplexSilverLink';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { inject } from '@angular/core';

export class AsHtmlLink extends ComplexSilverLink {
  public DomSanitizer = inject(DomSanitizer);

  override Name = 'As HTML';
  override Category = 'Output';
  override Description = `Parses as though it was HTML and shows the result.`;

  public override PerEntryOperation(entry: SilverLinkTextElement): SilverLinkTextElement {
    let newEntry: SilverLinkTextElement = {};

    if (entry.Text) {
      newEntry.Text = entry.Text;
      newEntry.HideTextField = true;
      newEntry.HTML = entry.Text;
    }

    return newEntry;
  }

  public ConvertSafeHtml(htmlString: string): SafeHtml {
    return this.DomSanitizer.bypassSecurityTrustHtml(htmlString);
  }

  public override New(): SilverLink {
    return new AsHtmlLink();
  }
}
