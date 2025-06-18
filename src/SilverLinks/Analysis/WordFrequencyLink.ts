import { SilverLink, SilverLinkTextElement } from 'src/services/links.service';

import { ComplexSilverLink } from '../ComplexSilverLink';
import { RemovePunctuation, UnescapeUserInput, RemoveNewLines, RemoveQuotes } from 'src/app/helpers';
import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SimpleTableData } from 'src/components/simple-table/simple-table.component';

export class WordFrequencyLink extends ComplexSilverLink {
  override Name = 'Word Frequency';
  override Category = 'Analysis';
  override Description = `Lists all the words in the text together with their frequency, sorted by frequency.`;

  override HasSettings = true;
  override ShowSettings = signal<boolean>(true);

  override Settings: { Include: boolean; Order: string } = { Include: false, Order: 'count' };
  override SettingsFormOptions = undefined;
  override SettingsForm: FormlyFieldConfig[] = [
    {
      key: 'Include',
      type: 'checkbox',
      defaultValue: false,
      props: {
        label: 'Include the analyzed text in the output?',
        required: false,
      },
    },
    {
      key: 'Order',
      type: 'select',
      defaultValue: 'count',
      props: {
        label: 'Include the analyzed text in the output?',
        required: false,
        options: [
          { label: 'Word', value: 'word' },
          { label: 'Count', value: 'count' },
        ],
      },
    },
  ];

  public override PerEntryOperation(entry: SilverLinkTextElement): SilverLinkTextElement {
    let newEntry: SilverLinkTextElement = {};

    if (!entry.Text || entry.Text.length === 0) {
      return newEntry;
    }

    if (this.Settings.Include) {
      newEntry.Text = entry.Text;
    }

    let text = entry.Text.toLowerCase();
    text = RemovePunctuation(text);
    text = RemoveNewLines(text);
    text = RemoveQuotes(text);

    const wordFrequenceMap = this.wordCountMap(text.split(' ').filter((word) => word.trim()));
    let keys = [...wordFrequenceMap.keys()].sort();

    if (this.Settings.Order == 'count') {
      keys = [...wordFrequenceMap.keys()].sort((a, b) => {
        return (wordFrequenceMap.get(b) || 0) - (wordFrequenceMap.get(a) || 0);
      });
    }

    let table: SimpleTableData = {
      Rows: [
        {
          Header: true,
          Columns: [
            {
              Text: 'Word',
            },
            {
              Text: 'Count',
            },
          ],
        },
      ],
    };

    for (const key of keys) {
      let value = wordFrequenceMap.get(key);
      if (value === undefined) {
        continue;
      }

      table.Rows.push({
        Columns: [{ Text: key }, { Text: value.toLocaleString('en-US') }],
      });
    }

    newEntry.Table = table;

    return newEntry;
  }

  public override New(): SilverLink {
    return new WordFrequencyLink();
  }

  wordCountMap(words: string[]): Map<string, number> {
    const wordCountMap = new Map<string, number>();

    for (const word of words) {
      const currentCount = wordCountMap.get(word) || 0;
      wordCountMap.set(word, currentCount + 1);
    }

    return wordCountMap;
  }
}
