import { SilverLink, SilverLinkTextElement } from 'src/services/links.service';

import { ComplexSilverLink } from '../ComplexSilverLink';

export class AsHtmlLink extends ComplexSilverLink {
  override Name = 'As HTML';
  override Category = 'Output';
  override Description = `Parses as though it was HTML and shows the result.`;

  public override PerEntryOperation(entry: SilverLinkTextElement): SilverLinkTextElement {
    let newEntry: SilverLinkTextElement = {};

    if (entry.Text) {
      newEntry.HTMLString = entry.Text;
    }

    return newEntry;
  }
  public override New(): SilverLink {
    return new AsHtmlLink();
  }
}
