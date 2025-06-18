import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';
import { UnescapeUserInput } from 'src/app/helpers';

export class ExtractDatesLink extends BasicSilverLink {
  override Name = 'Extract Dates';
  override Category = 'Extraction';
  override Description = `Extract all dates from a text.`;

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
    //Based on https://github.com/masterhimanshupoddar/REGEX-to-capture-dates-of-all-format-from-text-file
    const regex =
      /(\d{1,2}[-/]\d{1,2}[/-]\d{2,4})|(\d{1,2}\/\d{4})|((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[ -.]*\d{2}[thsdn, .-]*\d{4})|((?:\d{1,2} )?(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[,. ]*\d{4})|(\d{4})/g;

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
    return new ExtractDatesLink();
  }
}
