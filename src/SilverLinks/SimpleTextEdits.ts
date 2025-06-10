import { input, signal, Signal } from '@angular/core';
import { FormlyFieldConfig, FormlyFieldProps, FormlyFormOptions } from '@ngx-formly/core';
import { SilverLink } from 'src/services/links.service';
import { v4 as uuidv4 } from 'uuid';

export class ToLowerCaseLink implements SilverLink {
  public Error = signal<boolean>(false);
  public Output = signal<string>('');
  public Disabled = signal<boolean>(false);

  public Id: string = uuidv4();
  public Name: string = 'To Lower Case';
  public Category: string = 'Transformation';
  public Description: string = `Converts text into lower case. \n Input: A sentence with SOME Upper Case letters. \n Output: a sentence with some upper case letters.`;

  public HasSettings: boolean = false;
  public ShowSettings = signal<boolean>(false);

  public Parse(Input: string): string {
    let result = Input.toLocaleLowerCase();
    this.Output.set(result);
    return result;
  }

  public New(): SilverLink {
    return new ToLowerCaseLink();
  }
}

export class ToUpperCaseLink implements SilverLink {
  public Error = signal<boolean>(false);
  public Output = signal<string>('');
  public Disabled = signal<boolean>(false);

  public Id: string = uuidv4();
  public Name: string = 'To Upper Case';
  public Category: string = 'Transformation';
  public Description: string = `Converts text into upper case. \n Input: A sentence with SOME Upper Case letters. \n Output: A SENTENCE WITH SOME UPPER CASE LETTERS.`;

  public HasSettings: boolean = false;
  public ShowSettings = signal<boolean>(false);

  public Parse(Input: string): string {
    let result = Input.toLocaleUpperCase();
    this.Output.set(result);

    return result;
  }

  public New(): SilverLink {
    return new ToUpperCaseLink();
  }
}

export class TrimTextLink implements SilverLink {
  public Error = signal<boolean>(false);
  public Output = signal<string>('');
  public Disabled = signal<boolean>(false);

  public Id: string = uuidv4();
  public Name: string = 'Trim Whitespace';
  public Category: string = 'Transformation';
  public Description: string = `Removes extra whitespace around the text to "clean" it.`;

  public HasSettings: boolean = true;
  public ShowSettings = signal<boolean>(true);

  public Settings: { PerLineTrim: boolean } = { PerLineTrim: false };
  public SettingsFormOptions = undefined;
  public SettingsForm: FormlyFieldConfig[] = [
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

  public Parse(Input: string): string {
    if (!this.Settings.PerLineTrim) {
      return Input.trim();
    }

    if (Input === '') {
      return '';
    }

    let lines = Input.split('\n');
    let output = '';
    for (let line of lines) {
      if (/\S/.test(line)) {
        // Line contains non-whitespace characters, trim it
        output += line.trim() + '\n';
      } else {
        // Line is wholly whitespace, keep it as-is
        output += line + '\n';
      }
    }
    this.Output.set(output);
    return output;
  }

  public New(): SilverLink {
    return new TrimTextLink();
  }
}
