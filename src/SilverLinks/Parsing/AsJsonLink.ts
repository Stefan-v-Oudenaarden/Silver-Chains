import { SilverLink, SilverLinkTextElement } from 'src/services/links.service';

import { ComplexSilverLink } from '../ComplexSilverLink';

export class AsJsonLink extends ComplexSilverLink {
  override Name = 'As JSON';
  override Category = 'Output';
  override Description = `Parses as though it was JSON and shows the result if successfull`;

  public override PerEntryOperation(entry: SilverLinkTextElement): SilverLinkTextElement {
    let newEntry: SilverLinkTextElement = {};

    try {
      if (entry.Text) {
        newEntry.Text = entry.Text;
        newEntry.HideTextField = true;
        newEntry.Object = JSON.parse(entry.Text);
      }
    } catch (e: any) {
      console.warn(e);
      newEntry.Text = e;
    }

    return newEntry;
  }
  public override New(): SilverLink {
    return new AsJsonLink();
  }
}
