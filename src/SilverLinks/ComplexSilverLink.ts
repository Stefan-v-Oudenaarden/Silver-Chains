import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink, SilverLinkData, SilverLinkTextElement } from 'src/services/links.service';
import { v4 as uuidv4 } from 'uuid';

export abstract class ComplexSilverLink implements SilverLink {
  public Error = signal<boolean>(false);
  public Output = signal<SilverLinkData>(new SilverLinkData(''));
  public Disabled = signal<boolean>(false);

  public Id: string = uuidv4();
  public Name: string = '';
  public Category: string = '';
  public Description: string = '';

  public HasSettings: boolean = false;
  public ShowSettings = signal<boolean>(false);

  public Settings: any;
  public SettingsFormOptions = undefined;
  public SettingsForm: FormlyFieldConfig[] = [];

  public Run(Input: SilverLinkData): SilverLinkData {
    let Output = new SilverLinkData('');
    try {
      Output = this.SimpleTextParse(Input);
      this.Error.set(false);
    } catch (e: any) {
      Output.DataFields[0].Text = e;
      this.Error.set(true);
    }
    return Output;
  }

  private SimpleTextParse(Input: SilverLinkData): SilverLinkData {
    let output = new SilverLinkData();

    for (let entry of Input.DataFields) {
      output.DataFields.push(this.PerEntryOperation(entry));
    }

    this.Output.set(output);
    return output;
  }

  public abstract PerEntryOperation(entry: SilverLinkTextElement): SilverLinkTextElement;

  public abstract New(): SilverLink;
}
