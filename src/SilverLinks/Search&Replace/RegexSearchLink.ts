import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink, SilverLinkTextElement } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';
import { UnescapeUserInput } from 'src/app/helpers';
import { SimpleDataColumn, SimpleTableData } from 'src/components/simple-table/simple-table.component';
import { ComplexSilverLink } from '../ComplexSilverLink';

export class RegexSearchLink extends ComplexSilverLink {
  override Name = 'Regex Search';
  override Category = 'Find and Replace';
  override Description = `Apply a regex and display the results in a table.`;

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
        label: 'Regex',
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
    {
      key: 'MultiLine',
      type: 'checkbox',
      defaultValue: false,
      props: {
        label: 'Multi Line?',
        required: false,
      },
    },
    {
      key: 'DisplayType',
      type: 'select',
      defaultValue: 'highlights',
      props: {
        label: 'Output',
        required: false,
        options: [
          { label: 'Highlight Matches', value: 'highlights' },
          { label: 'Matches', value: 'match' },
          { label: 'Groups', value: 'groups' },
          { label: 'Match with Groups', value: 'matchgroups' },
          { label: 'Table', value: 'table' },
        ],
      },
    },
  ];

  public override PerEntryOperation(entry: SilverLinkTextElement): SilverLinkTextElement {
    let output: SilverLinkTextElement = {};
    const Text = entry.Text;

    console.log(Text);

    if (this.Settings.FindString === undefined || this.Settings.FindString.length === 0 || Text === undefined || Text.length === 0) {
      output.Text = Text;
      return output;
    }

    let regexOptions = 'g';
    if (!this.Settings.IgnoreCase) {
      regexOptions += 'i';
    }

    if (!this.Settings.MultiLine) {
      regexOptions += 'm';
    }

    const regex = new RegExp(UnescapeUserInput(this.Settings.FindString), regexOptions);

    switch (this.Settings.DisplayType) {
      case 'highlights':
        output.Text = Text;
        output.HideTextField = true;
        output.HTMLString = this.BuildHtmlHighlight(regex, Text);
        break;

      case 'match':
        var results = this.RegexMatchToArray(Text.matchAll(regex));
        output.Text = this.BuildTextMatch(results);
        break;

      case 'groups':
        var results = this.RegexMatchToArray(Text.matchAll(regex));
        output.Text = this.BuildTextGroups(results);
        break;

      case 'matchgroups':
        var results = this.RegexMatchToArray(Text.matchAll(regex));
        output.Text = this.BuildTextMatchGroups(results);
        break;

      default:
      case 'table':
        output.Text = Text;
        output.HideTextField = true;
        var results = this.RegexMatchToArray(Text.matchAll(regex));
        output.Table = this.BuildTable(results);
        break;
    }

    return output;
  }

  private RegexMatchToArray(results: RegExpStringIterator<RegExpExecArray>): RegExpExecArray[] {
    let output = [];

    for (const result of results) {
      output.push(result);
    }

    return output;
  }

  private BuildHtmlHighlight(regex: RegExp, text: string): string {
    let highLightCount = 1;

    let replacementList: { token: string; replacement: string }[] = [];

    let highlightText = text.replaceAll(regex, (substring: string, ...args: any[]) => {
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

  private BuildTable(result: RegExpExecArray[]): SimpleTableData {
    let longestRow = 0;

    let table: SimpleTableData = {
      Rows: [
        {
          Header: true,
          Columns: [
            {
              Text: 'Result',
            },
          ],
        },
      ],
    };

    for (const row of result) {
      const length = row.length - 1;
      if (length > longestRow) {
        longestRow = length;
      }

      const tableColumn: SimpleDataColumn[] = [];

      for (const col of row) {
        tableColumn.push({ Text: col });
      }

      table.Rows.push({ Columns: tableColumn });
    }

    for (let i = 0; i < longestRow; i++) {
      table.Rows[0].Columns.push({
        Text: 'Group ' + (i + 1),
      });
    }

    return table;
  }

  private BuildTextMatchGroups(result: RegExpExecArray[]): string {
    let output = '';
    for (const row of result) {
      let textRow: string[] = [];
      for (const col of row) {
        textRow.push(col);
      }

      output += textRow.join('\n\t') + '\n\n';
    }

    return output;
  }

  private BuildTextMatch(result: RegExpExecArray[]): string {
    let output: string[] = result.map((row) => row[0]);

    return output.join('\n\n');
  }

  private BuildTextGroups(result: RegExpExecArray[]): string {
    let output = '';
    for (const row of result) {
      let textRow: string[] = [];
      for (const col of row.slice(1)) {
        textRow.push(col);
      }

      output += textRow.join('\n') + '\n\n';
    }

    return output;
  }

  public override New(): SilverLink {
    return new RegexSearchLink();
  }
}
