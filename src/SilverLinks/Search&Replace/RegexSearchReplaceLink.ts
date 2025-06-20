import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';
import { UnescapeUserInput } from 'src/app/helpers';

export class RegexSearchReplaceLink extends BasicSilverLink {
  override Name = 'Regex Find and Replace';
  override Category = 'Find and Replace';
  override Description = `Looks for a given text using a regular expression and replaces it with the provided text.`;

  override HasSettings = true;
  override ShowSettings = signal<boolean>(true);

  override Settings: {
    FindString: string;
    ReplacementString: string;
    IgnoreCase: boolean;
    MultiLine: boolean;
  } = {
    FindString: '',
    ReplacementString: '',
    IgnoreCase: true,
    MultiLine: false,
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
        label: 'Replace with, use $1, $2 etc for capture groups',
        required: false,
      },
    },
    {
      key: 'IgnoreCase',
      type: 'checkbox',
      defaultValue: true,
      props: {
        label: 'Case Sensitive?',
        required: false,
      },
    },
    {
      key: 'MultiLine',
      type: 'checkbox',
      defaultValue: false,
      props: {
        label: 'Multi Line?',
        required: false,
      },
    },
  ];

  public override PerTextOperation(Text: string): string {
    let find = UnescapeUserInput(this.Settings.FindString);
    let replace = UnescapeUserInput(this.Settings.ReplacementString);

    let regexOptions = 'g';
    if (!this.Settings.IgnoreCase) {
      regexOptions += 'i';
    }

    if (!this.Settings.MultiLine) {
      regexOptions += 'm';
    }

    const regex = new RegExp(UnescapeUserInput(find), regexOptions);

    return Text.replaceAll(regex, (substring: string, ...args: any[]) => {
      let replacement = replace;

      let groups = args.slice(0, -2);

      for (const group of groups) {
        const i = groups.indexOf(group) + 1;
        replacement = replacement.replaceAll(`$${i}`, group);
        console.log(replacement, `$${i}`);
      }

      return replacement;
    });
  }

  public override New(): SilverLink {
    return new RegexSearchReplaceLink();
  }
}
