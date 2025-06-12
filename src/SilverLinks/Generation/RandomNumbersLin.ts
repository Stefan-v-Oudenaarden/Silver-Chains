import { input, signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink, SilverLinkData } from 'src/services/links.service';
import { CustomSilverLink } from '../CustomSilverLinks';

export class RandomNumbersLink extends CustomSilverLink {
  override Name = 'Random Numbers';
  override Category = 'Generation';
  override Description = `Generates Random Numbers.`;

  override HasSettings = true;
  override ShowSettings = signal<boolean>(true);

  override Settings: { Amount: number; Append: boolean; High: number; Low: number } = {
    Amount: 1,
    Append: false,
    Low: 1,
    High: 6,
  };
  override SettingsFormOptions = undefined;
  override SettingsForm: FormlyFieldConfig[] = [
    {
      key: 'Append',
      type: 'checkbox',
      defaultValue: false,
      props: {
        label: 'Append instead of overwrite?',
        required: false,
      },
    },

    {
      fieldGroupClassName: 'formly-display-flex',
      fieldGroup: [
        {
          className: 'formly-flex-1',
          key: 'Low',
          type: 'number',
          defaultValue: 1,
          props: {
            label: 'Low (Inclusive)',
            required: true,
          },
        },
        {
          className: 'formly-flex-1',
          key: 'High',
          type: 'number',
          defaultValue: 6,
          props: {
            label: 'High (Inclusive)',
            required: true,
          },
        },
      ],
    },
    {
      key: 'Amount',
      type: 'number',
      defaultValue: false,
      props: {
        label: 'How many numbers ?',
        required: false,
      },
    },
  ];

  public override Run(Input: SilverLinkData): SilverLinkData {
    let original: string | undefined = undefined;
    let numbers: number[] = [];

    for (let i = 0; i < this.Settings.Amount; i++) {
      numbers.push(this.GetRandomNumber(this.Settings.Low, this.Settings.High));
    }

    let numbersString = numbers.join(',');

    if (this.Settings.Append) {
      if (Input.DataFields.length > 0 && Input.DataFields[0].Text !== undefined) {
        original = Input.DataFields[0].Text;
      }
    }

    return new SilverLinkData([original, numbersString].join('\n'));
  }

  public override New(): SilverLink {
    return new RandomNumbersLink();
  }

  private GetRandomNumber(LowerBound: number, UpperBound: number) {
    return Math.floor(Math.random() * (UpperBound - LowerBound + 1)) + LowerBound;
  }
}
