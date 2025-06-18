import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';
import { UnescapeUserInput } from 'src/app/helpers';

export class ExtractNumbersLink extends BasicSilverLink {
  override Name = 'Extract Numbers';
  override Category = 'Extraction';
  override Description = `Extract all numbers from a text.`;

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

  public override PerTextOperation(Text: string): string {
    let regex = /[-]{0,1}[\d]*[,]?[\d]*[.]{0,1}[\d]+/g;
    let joiner = UnescapeUserInput(this.Settings.Joiner);
    let results = Text.matchAll(regex);

    if (!results) {
      return '';
    }

    let numbers: string[] = [];
    for (const result of results) {
      numbers.push(result[0].toString());
    }

    return numbers.join(joiner);
  }
  public override New(): SilverLink {
    return new ExtractNumbersLink();
  }
}
