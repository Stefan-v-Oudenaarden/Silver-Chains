import { SilverLink, SilverLinkTextElement } from 'src/services/links.service';

import { ComplexSilverLink } from '../ComplexSilverLink';
import { ellipseSharp } from 'ionicons/icons';

export class AsMarkdownLink extends ComplexSilverLink {
  override Name = 'As Markdown';
  override Category = 'Output';
  override Description = `Parses input as  Markdown`;

  public override PerEntryOperation(entry: SilverLinkTextElement): SilverLinkTextElement {
    let newEntry: SilverLinkTextElement = {};

    if (entry.Text) {
      newEntry.Markdown = entry.Text;
    }

    return newEntry;
  }
  public override New(): SilverLink {
    return new AsMarkdownLink();
  }
}
