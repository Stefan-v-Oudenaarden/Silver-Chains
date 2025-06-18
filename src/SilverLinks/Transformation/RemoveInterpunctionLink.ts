import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';

export class RemoveInterpunctionLink extends BasicSilverLink {
  override Name = 'Remove Interpunction';
  override Category = 'Transformation';
  override Description = `Removes various kinds of whitespace from the text.`;

  override HasSettings = true;
  override ShowSettings = signal<boolean>(true);

  override Settings: {
    Exclamation: boolean;
    Period: boolean;
    QuestionMark: boolean;
    SingleQuotes: boolean;
    DoubleQuotes: boolean;
    SlantQuotes: boolean;
  } = {
    Exclamation: true,
    Period: true,
    QuestionMark: true,
    SingleQuotes: false,
    DoubleQuotes: false,
    SlantQuotes: false,
  };

  override SettingsForm: FormlyFieldConfig[] = [
    {
      key: 'Period',
      type: 'checkbox',
      defaultValue: true,
      props: {
        label: 'Period (.)',
        required: false,
      },
    },
    {
      key: 'Exclamation',
      type: 'checkbox',
      defaultValue: true,
      props: {
        label: 'Exclamation Mark (!)',
        required: false,
      },
    },

    {
      key: 'QuestionMark',
      type: 'checkbox',
      defaultValue: true,
      props: {
        label: 'Question Mark (?)',
        required: false,
      },
    },
    {
      key: 'SingleQuotes',
      type: 'checkbox',
      defaultValue: false,
      props: {
        label: "Single Quotes (')",
        required: false,
      },
    },
    {
      key: 'DoubleQuotes',
      type: 'checkbox',
      defaultValue: true,
      props: {
        label: 'Double Quotes (") ',
        required: false,
      },
    },
    {
      key: 'SlantQuotes',
      type: 'checkbox',
      defaultValue: false,
      props: {
        label: 'Curly quotes (‘ “)',
        required: false,
      },
    },
  ];

  public override PerTextOperation(Text: string): string {
    console.log(Text, this.Settings);

    if (this.Settings.Exclamation) {
      Text = Text.replaceAll('!', '');
    }

    if (this.Settings.Period) {
      Text = Text.replaceAll('.', '');
    }

    if (this.Settings.QuestionMark) {
      Text = Text.replaceAll('?', '');
    }

    if (this.Settings.SingleQuotes) {
      Text = Text.replaceAll("'", '');
      Text = Text.replaceAll('`', '');
    }

    if (this.Settings.DoubleQuotes) {
      Text = Text.replaceAll('"', '');
    }

    if (this.Settings.SlantQuotes) {
      Text = Text.replace(/[‘’“”]/g, '');
    }

    console.log(Text);
    return Text;
  }

  public override New(): SilverLink {
    return new RemoveInterpunctionLink();
  }
}
