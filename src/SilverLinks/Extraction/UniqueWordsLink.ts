import { SilverLink, SilverLinkTextElement } from 'src/services/links.service';

import { ComplexSilverLink } from '../ComplexSilverLink';
import { RemovePunctuation, UnescapeUserInput, RemoveNewLines } from 'src/app/helpers';
import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

export class UniqueWordsLink extends ComplexSilverLink {
  override Name = 'Unique Words';
  override Category = 'Extraction';
  override Description = `Lists all the words in the text.`;

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

    let text = entry.Text.toLowerCase();
    text = RemovePunctuation(text);
    text = RemoveNewLines(text);

    const words = text.split(' ');
    const dinstinctWords = Array.from(new Set<string>(words));

    newEntry.Text = dinstinctWords
      .filter((word) => {
        return word.trim().length > 0;
      })
      .join(joiner);

    return newEntry;
  }
  public override New(): SilverLink {
    return new UniqueWordsLink();
  }
}
