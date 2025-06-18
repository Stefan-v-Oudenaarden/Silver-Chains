import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';

export class TrimTextLink extends BasicSilverLink {
  override Name = 'Trim Whitespace';
  override Category = 'Transformation';
  override Description = `Removes extra whitespace around the text to "clean" it.`;

  override HasSettings = true;
  override ShowSettings = signal<boolean>(false);

  override Settings: { PerLineTrim: boolean } = { PerLineTrim: false };
  override SettingsFormOptions = undefined;
  override SettingsForm: FormlyFieldConfig[] = [
    {
      key: 'PerLineTrim',
      type: 'checkbox',
      defaultValue: false,
      props: {
        label: 'Trim By Line?',
        required: false,
      },
    },
  ];

  public override PerTextOperation(Text: string): string {
    if (!this.Settings.PerLineTrim) {
      return Text.trim();
    }

    if (Text === '') {
      return '';
    }

    let lines = Text.split('\n');
    let trimmedText = '';
    for (let line of lines) {
      if (/\S/.test(line)) {
        // Line contains non-whitespace characters, trim it
        trimmedText += line.trim() + '\n';
      } else {
        // Line is wholly whitespace, keep it as-is
        trimmedText += line + '\n';
      }
    }

    return trimmedText.trim();
  }
  public override New(): SilverLink {
    return new TrimTextLink();
  }
}
