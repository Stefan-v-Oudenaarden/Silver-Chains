import { input, signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { UnescapeUserInput } from 'src/app/helpers';
import { SilverLink, SilverLinkData } from 'src/services/links.service';
import { v4 as uuidv4 } from 'uuid';

export class SplitTextLink implements SilverLink {
  public Error = signal<boolean>(false);
  public Output = signal<SilverLinkData>(new SilverLinkData(''));
  public Disabled = signal<boolean>(false);

  public Id: string = uuidv4();
  public Searchterms: string = '';
  public Name: string = 'Split Text';
  public Category: string = 'Splitting & Joining';
  public Description: string = 'Splits Text on newlines';

  public HasSettings: boolean = true;
  public ShowSettings = signal<boolean>(false);

  public Settings: { Splitter: string } = { Splitter: '\\n\\n' };
  public SettingsFormOptions = undefined;
  public SettingsForm: FormlyFieldConfig[] = [
    {
      key: 'Splitter',
      type: 'input',
      defaultValue: '\\n\\n',
      props: {
        label: 'Delimiter',
        required: false,
      },
    },
  ];

  public Run(Input: SilverLinkData): SilverLinkData {
    let output = new SilverLinkData('');
    try {
      output = this.SplitText(Input);
    } catch {
      this.Error.set(true);
    }

    return output;
  }

  SplitText(input: SilverLinkData): SilverLinkData {
    let output = new SilverLinkData();

    const Splitter = UnescapeUserInput(this.Settings.Splitter);

    for (const entry of input.DataFields) {
      if (entry.Text !== undefined) {
        const lines = entry.Text.split(Splitter);

        for (const line of lines) {
          if (line === '') {
            continue;
          }
          output.DataFields.push({ Text: line });
        }
      }
    }

    return output;
  }

  public New(): SilverLink {
    return new SplitTextLink();
  }

  public LoadSettings(Input: any): void {
    if (this.HasSettings) {
      this.Settings = Input;
    }
  }
}

export class JoinTextLink implements SilverLink {
  public Error = signal<boolean>(false);
  public Output = signal<SilverLinkData>(new SilverLinkData(''));
  public Disabled = signal<boolean>(false);

  public Id: string = uuidv4();
  public Searchterms: string = '';
  public Name: string = 'Join Text';
  public Category: string = 'Splitting & Joining';
  public Description: string = 'Join all existing fields back into one field with newlines in between.';

  public HasSettings: boolean = true;
  public ShowSettings = signal<boolean>(false);

  public Settings: { Joiner: string } = { Joiner: '\\n\\n' };
  public SettingsFormOptions = undefined;
  public SettingsForm: FormlyFieldConfig[] = [
    {
      key: 'Joiner',
      type: 'input',
      defaultValue: '\\n\\n',
      props: {
        label: 'Delimiter',
        required: false,
      },
    },
  ];

  public Run(Input: SilverLinkData): SilverLinkData {
    let output = new SilverLinkData('');
    try {
      output = this.JoinText(Input);
    } catch {
      this.Error.set(true);
    }

    return output;
  }

  JoinText(input: SilverLinkData): SilverLinkData {
    let output = new SilverLinkData('');
    let allTextFields = [];

    for (const entry of input.DataFields) {
      if (entry.Text !== undefined) {
        allTextFields.push(entry.Text);
      }
    }

    if (allTextFields.length !== 0) {
      const joiner = UnescapeUserInput(this.Settings.Joiner);
      output = new SilverLinkData(allTextFields.join(joiner));
    }

    return output;
  }

  public New(): SilverLink {
    return new JoinTextLink();
  }

  public LoadSettings(Input: any): void {
    if (this.HasSettings) {
      this.Settings = Input;
    }
  }
}
