import { SilverLink, SilverLinkTextElement } from 'src/services/links.service';

import { ComplexSilverLink } from '../ComplexSilverLink';
import { RemovePunctuation, UnescapeUserInput } from 'src/app/helpers';
import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

export class UniqueLinesLink extends ComplexSilverLink {
  override Name = 'Unique Lines';
  override Category = 'Extraction';
  override Description = `Lists all the unique lines in the text.`;

  override HasSettings = true;
  override ShowSettings = signal<boolean>(false);

  override Settings: {
    Joiner: string;
  } = {
    Joiner: '\\n',
  };

  override SettingsForm: FormlyFieldConfig[] = [
    {
      key: 'Joiner',
      type: 'input',
      defaultValue: '\\n',
      props: {
        label: 'Delimter',
        required: false,
      },
    },
  ];

  public override PerEntryOperation(entry: SilverLinkTextElement): SilverLinkTextElement {
    let newEntry: SilverLinkTextElement = {};
    let joiner = UnescapeUserInput(this.Settings.Joiner);

    if (!entry.Text || entry.Text.length === 0) {
      return newEntry;
    }

    const lines = entry.Text.split('\n');
    const dinstinctLines = Array.from(new Set<string>(lines));

    newEntry.Text = dinstinctLines.filter((line) => line).join(joiner);

    return newEntry;
  }
  public override New(): SilverLink {
    return new UniqueLinesLink();
  }
}
