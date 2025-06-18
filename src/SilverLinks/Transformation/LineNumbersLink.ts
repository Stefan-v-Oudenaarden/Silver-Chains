import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';

export class AddLineNumbersLink extends BasicSilverLink {
  override Name = 'Add Line Numbers';
  override Category = 'Transformation';
  override Description = `Adds line numbers before all the lines.`;

  override HasSettings = true;
  override ShowSettings = signal<boolean>(false);

  override Settings: {
    StartValue: number;
    Increment: number;
  } = {
    StartValue: 1,
    Increment: 1,
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
    {
      key: 'Increment',
      type: 'number',
      defaultValue: 1,
      props: {
        label: 'Increase by',
        required: false,
      },
    },
  ];

  public override PerTextOperation(Text: string): string {
    return Text.split('\n')
      .map((line, index) => `${this.Settings.StartValue + index * this.Settings.Increment} ${line}`)
      .join('\n');
  }
  public override New(): SilverLink {
    return new AddLineNumbersLink();
  }
}

export class RemoveLineNumbersLink extends BasicSilverLink {
  override Name = 'Remove Line Numbers';
  override Category = 'Transformation';
  override Description = `Remove any numbers at the start of a line.`;

  public override PerTextOperation(Text: string): string {
    return Text.split('\n')
      .map((line) => {
        let words = line.split(' ').filter((word) => {
          console.log(word, !/^[0-9]$/.test(word));
          return !/^[0-9]+$/.test(word);
        });
        return words.join(' ');
      })
      .join('\n');
  }

  public override New(): SilverLink {
    return new RemoveLineNumbersLink();
  }
}
