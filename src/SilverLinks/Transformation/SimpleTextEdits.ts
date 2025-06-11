import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';

export class ToLowerCaseLink extends BasicSilverLink {
  override Name = 'To Lower Case';
  override Category = 'Transformation';
  override Description = `Converts text into lower case. \n Input: A sentence with SOME Upper Case letters. \n Output: a sentence with some upper case letters.`;

  public override PerTextOperation(Text: string): string {
    return Text.toLocaleLowerCase();
  }
  public override New(): SilverLink {
    return new ToLowerCaseLink();
  }
}

export class ToUpperCaseLink extends BasicSilverLink {
  override Name = 'To Upper Case';
  override Category = 'Transformation';
  override Description = `Converts text into upper case. \n Input: A sentence with SOME Upper Case letters. \n Output: A SENTENCE WITH SOME UPPER CASE LETTERS.`;

  public override PerTextOperation(Text: string): string {
    return Text.toLocaleUpperCase();
  }
  public override New(): SilverLink {
    return new ToUpperCaseLink();
  }
}

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

    return trimmedText;
  }
  public override New(): SilverLink {
    return new TrimTextLink();
  }
}
