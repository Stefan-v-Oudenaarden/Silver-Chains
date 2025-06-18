import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';

export class RemoveWhiteSpaceLink extends BasicSilverLink {
  override Name = 'Remove Whitespace';
  override Category = 'Transformation';
  override Description = `Removes various kinds of whitespace from the text.`;

  override HasSettings = true;
  override ShowSettings = signal<boolean>(true);

  override Settings: {
    Spaces: boolean;
    NewLines: boolean;
    DoubleNewlines: boolean;
    Tabs: boolean;
  } = {
    Spaces: false,
    NewLines: false,
    DoubleNewlines: true,
    Tabs: false,
  };

  override SettingsForm: FormlyFieldConfig[] = [
    {
      key: 'Spaces',
      type: 'checkbox',
      defaultValue: false,
      props: {
        label: 'Spaces',
        required: false,
      },
    },
    {
      key: 'NewLines',
      type: 'checkbox',
      defaultValue: false,
      props: {
        label: 'New Lines',
        required: false,
      },
    },
    {
      key: 'DoubleNewlines',
      type: 'checkbox',
      defaultValue: true,
      props: {
        label: 'Paragraphs (Double New Lines)',
        required: false,
      },
    },
    {
      key: 'Tabs',
      type: 'checkbox',
      defaultValue: false,
      props: {
        label: 'Tabs',
        required: false,
      },
    },
  ];

  public override PerTextOperation(Text: string): string {
    console.log(Text, this.Settings);

    if (this.Settings.Spaces) {
      console.log('spaces');
      Text = Text.replaceAll(' ', '');
    }

    if (this.Settings.NewLines) {
      console.log('newlines');
      Text = Text.replaceAll('\r', '');
      Text = Text.replaceAll('\n', '');
    }

    if (this.Settings.DoubleNewlines) {
      console.log('double newlines');
      Text = Text.replaceAll('\r\r', '');
      Text = Text.replaceAll('\n\n', '');
      Text = Text.replaceAll('\r\r\n\n', '');
    }

    if (this.Settings.Tabs) {
      console.log('tabs');
      Text = Text.replaceAll('\t', '');
    }

    console.log(Text);
    return Text;
  }

  public override New(): SilverLink {
    return new RemoveWhiteSpaceLink();
  }
}
