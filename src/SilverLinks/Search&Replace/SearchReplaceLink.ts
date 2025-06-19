import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';
import { UnescapeUserInput } from 'src/app/helpers';

export class SearchReplaceLink extends BasicSilverLink {
  override Name = 'Find and Replace';
  override Category = 'Find and Replace';
  override Description = `Looks for a given text and replaces it with the provided text.`;

  override HasSettings = true;
  override ShowSettings = signal<boolean>(true);

  override Settings: {
    FindString: string;
    ReplacementString: string;
    IgnoreCase: boolean;
  } = {
    FindString: '',
    ReplacementString: '',
    IgnoreCase: false,
  };

  override SettingsForm: FormlyFieldConfig[] = [
    {
      key: 'FindString',
      type: 'string',
      defaultValue: '',
      props: {
        label: 'Find',
        required: false,
      },
    },
    {
      key: 'ReplacementString',
      type: 'string',
      defaultValue: '',
      props: {
        label: 'Replace with',
        required: false,
      },
    },
    {
      key: 'IgnoreCase',
      type: 'checkbox',
      defaultValue: '',
      props: {
        label: 'Case Sensitive?',
        required: false,
      },
    },
  ];

  public override PerTextOperation(Text: string): string {
    let find = UnescapeUserInput(this.Settings.FindString);
    let replace = UnescapeUserInput(this.Settings.ReplacementString);

    if (this.Settings.IgnoreCase) {
      return this.findAndReplace(Text, find, replace);
    }
    return Text.replaceAll(find, replace);
  }

  public override New(): SilverLink {
    return new SearchReplaceLink();
  }

  private findAndReplace(text: string, find: string, replace: string): string {
    if (!find) {
      return text;
    }

    const escapedSearchValue = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const regex = new RegExp(escapedSearchValue, 'gi');
    return text.replace(regex, replace);
  }
}
