import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';
import { UnescapeUserInput } from 'src/app/helpers';

export class ExtractEmailsLink extends BasicSilverLink {
  override Name = 'Extract Emails';
  override Category = 'Extraction';
  override Description = `Extract all emails from a text.`;

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
    // email regex from: https://www.regextester.com/98066
    const regex =
      /(?:[\u00A0-\uD7FF\uE000-\uFFFFa-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[\u00A0-\uD7FF\uE000-\uFFFFa-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[\u00A0-\uD7FF\uE000-\uFFFFa-z0-9](?:[\u00A0-\uD7FF\uE000-\uFFFFa-z0-9-]*[\u00A0-\uD7FF\uE000-\uFFFFa-z0-9])?\.)+[\u00A0-\uD7FF\uE000-\uFFFFa-z0-9](?:[\u00A0-\uD7FF\uE000-\uFFFFa-z0-9-]*[\u00A0-\uD7FF\uE000-\uFFFFa-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\])/gi;

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
    return new ExtractEmailsLink();
  }
}
