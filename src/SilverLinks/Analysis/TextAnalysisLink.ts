import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink, SilverLinkTextElement } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';
import { ComplexSilverLink } from '../ComplexSilverLink';
import { SimpleTableData } from 'src/components/simple-table/simple-table.component';

export class TextAnalysisLink extends ComplexSilverLink {
  override Name = 'Text Analysis';
  override Category = 'Analysis';
  override Description = `Gives you basic information about text including word, lines, sentences, paragraph counts.`;

  override HasSettings = true;
  override ShowSettings = signal<boolean>(false);

  override Settings: { Include: boolean } = { Include: false };
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
  ];

  public override PerEntryOperation(entry: SilverLinkTextElement): SilverLinkTextElement {
    let newEntry: SilverLinkTextElement = {};

    newEntry.Text = entry.Text;
    newEntry.HideTextField = !this.Settings.Include;

    console.log(newEntry);

    if (!entry.Text) {
      return newEntry;
    }

    let result = this.AnalyiseText(entry.Text.trim());

    let table: SimpleTableData = {
      Rows: [
        {
          Header: true,
          Columns: [
            {
              Text: 'Type',
            },
            {
              Text: 'Resut',
            },
          ],
        },
      ],
    };

    for (const key of result.keys()) {
      let value = result.get(key);
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

  private AnalyiseText(text: string): Map<string, number> {
    let result = new Map<string, number>([
      ['Characters', this.CountChars(text)],
      ['Characters ( No Spaces )', this.CountChars(text, false)],
      ['Words', this.WordCount(text)],
      ['Lines', this.LineCount(text)],
      ['Sentences', this.SentenceCount(text)],
      ['Paragraphs', this.ParagraphCount(text)],
    ]);
    return result;
  }

  private CountChars(text: string, countSpaces: boolean = true): number {
    if (countSpaces) {
      return text.length;
    } else {
      const noSpacetext = text.replace(/\W/g, '');
      return noSpacetext.length;
    }
  }

  private WordCount(text: string): number {
    return text.split(/\s+/).length;
  }

  private LineCount(text: string): number {
    return text.split(/\r\n|\r|\n/).length;
  }

  private SentenceCount(text: string): number {
    return text.match(/(?<!\b(?:Dr|Mr|Mrs|Ms|Prof|Sr|Jr)\s*)[.!?]+(?=\s+[A-Z]|$)/g)?.length || 0;
  }

  private ParagraphCount(text: string): number {
    return text.split(/(?:\r\n|\r|\n)\s*(?:\r\n|\r|\n)/).filter((p) => p.trim() !== '').length || 0;
  }

  public override New(): SilverLink {
    return new TextAnalysisLink();
  }
}
