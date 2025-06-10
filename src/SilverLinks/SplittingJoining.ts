import { input, signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink, SilverLinkData } from 'src/services/links.service';
import { v4 as uuidv4 } from 'uuid';

export class SplitTextLink implements SilverLink {
  public Error = signal<boolean>(false);
  public Output = signal<SilverLinkData>(new SilverLinkData(''));
  public Disabled = signal<boolean>(false);

  public Id: string = uuidv4();
  public Name: string = 'Split Text';
  public Category: string = 'Splitting & Joining';
  public Description: string = 'Splits Text on newlines';

  public HasSettings: boolean = false;
  public ShowSettings = signal<boolean>(false);

  public Settings: any;
  public SettingsFormOptions = undefined;
  public SettingsForm: FormlyFieldConfig[] = [];

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

    for (const entry of input.TextData) {
      if (entry.Text !== undefined) {
        const lines = entry.Text.split('\n');

        for (const line of lines) {
          output.TextData.push({ Text: line });
        }
      }
    }

    return output;
  }

  public New(): SilverLink {
    return new SplitTextLink();
  }
}

export class JoinTextLink implements SilverLink {
  public Error = signal<boolean>(false);
  public Output = signal<SilverLinkData>(new SilverLinkData(''));
  public Disabled = signal<boolean>(false);

  public Id: string = uuidv4();
  public Name: string = 'Join Text';
  public Category: string = 'Splitting & Joining';
  public Description: string = 'Join all existing fields back into one field with newlines in between.';

  public HasSettings: boolean = false;
  public ShowSettings = signal<boolean>(false);

  public Settings: any;
  public SettingsFormOptions = undefined;
  public SettingsForm: FormlyFieldConfig[] = [];

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

    for (const entry of input.TextData) {
      if (entry.Text !== undefined) {
        allTextFields.push(entry.Text);
      }
    }

    if (allTextFields.length !== 0) {
      output = new SilverLinkData(allTextFields.join('\n'));
    }

    return output;
  }

  public New(): SilverLink {
    return new JoinTextLink();
  }
}
