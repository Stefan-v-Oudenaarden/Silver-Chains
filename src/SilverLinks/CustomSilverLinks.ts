import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink, SilverLinkData, SilverLinkTextElement } from 'src/services/links.service';
import { v4 as uuidv4 } from 'uuid';

export abstract class CustomSilverLink implements SilverLink {
  public Error = signal<boolean>(false);
  public Output = signal<SilverLinkData>(new SilverLinkData(''));
  public Disabled = signal<boolean>(false);

  public Id: string = uuidv4();
  public Searchterms: string = '';
  public Name: string = '';
  public Category: string = '';
  public Description: string = '';

  public HasSettings: boolean = false;
  public ShowSettings = signal<boolean>(false);

  public Settings: any;
  public SettingsFormOptions = undefined;
  public SettingsForm: FormlyFieldConfig[] = [];

  public abstract Run(Input: SilverLinkData): SilverLinkData;

  public abstract New(): SilverLink;
}
