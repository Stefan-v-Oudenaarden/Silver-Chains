import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';
import { ArrayShuffle } from 'src/app/helpers';

export class PadLineLink extends BasicSilverLink {
  override Name = 'Padding';
  override Category = 'Transformation';
  override Description = `Pads the beginning or end of lines of text with the specified characters.
  
  **Input**: A sample sentence.   
  
  **Output**: *****A sample sentence.`;

  override HasSettings = true;
  override ShowSettings = signal<boolean>(true);

  override Settings: {
    Location: 'Start' | 'End';
    Amount: number;
    PadChar: string;
  } = {
    Location: 'Start',
    Amount: 1,
    PadChar: ' ',
  };

  override SettingsForm: FormlyFieldConfig[] = [
    {
      key: 'Location',
      type: 'select',
      defaultValue: 'BeeMovie',
      props: {
        label: 'Location',
        options: [
          { value: 'Start', label: 'Start' },
          { value: 'End', label: 'End' },
        ],
      },
    },
    {
      key: 'Amount',
      type: 'number',
      defaultValue: 1,
      props: {
        label: 'How many',
        required: false,
      },
    },
    {
      key: 'PadChar',
      type: 'string',
      defaultValue: '',
      props: {
        label: 'What',
        required: false,
      },
    },
  ];

  public override PerTextOperation(Text: string): string {
    let padString = this.Settings.PadChar.repeat(this.Settings.Amount).substring(0, this.Settings.Amount);

    if (this.Settings.Location === 'Start') {
      return Text.split('\n')
        .map((line) => `${padString}${line}`)
        .join('\n');
    }

    if (this.Settings.Location === 'End') {
      return Text.split('\n')
        .map((line) => `${line}${padString}`)
        .join('\n');
    }

    this.Error.set(true);
    return 'Invalid Padding Location';
  }
  public override New(): SilverLink {
    return new PadLineLink();
  }
}
