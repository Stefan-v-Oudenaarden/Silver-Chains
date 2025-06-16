import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';
import { ArrayShuffle } from 'src/app/helpers';

export class LineNumbersLink extends BasicSilverLink {
  override Name = 'Line Numbers';
  override Category = 'Transformation';
  override Description = `Adds line numbers before all the lines.`;

  override HasSettings = true;
  override ShowSettings = signal<boolean>(false);

  override Settings: {
    StartValue: number;
  } = {
    StartValue: 1,
  };

  override SettingsForm: FormlyFieldConfig[] = [
    {
      key: 'StartValue',
      type: 'number',
      defaultValue: 1,
      props: {
        label: 'Start at',
        required: false,
      },
    },
  ];

  public override PerTextOperation(Text: string): string {
    return Text.split('\n')
      .map((line, index) => `${this.Settings.StartValue + index} ${line}`)
      .join('\n');
  }
  public override New(): SilverLink {
    return new LineNumbersLink();
  }
}
