import { input, signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink, SilverLinkData } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';
import { CustomSilverLink } from '../CustomSilverLinks';
import { LoremIpsum } from 'lorem-ipsum';
import { JoinedString } from 'src/app/helpers';

export class LorempIpsumLink extends CustomSilverLink {
  override Name = 'Lorem Ipsum';
  override Category = 'Generation';
  override Description = `Generates Lorem Ipsum text. 
  Because sometimes you need that.`;

  override HasSettings = true;
  override ShowSettings = signal<boolean>(true);

  override Settings: { Static: boolean; Append: boolean; Type: string; Amount: number } = {
    Static: false,
    Append: false,
    Type: 'paragraphs',
    Amount: 3,
  };
  override SettingsFormOptions = undefined;
  override SettingsForm: FormlyFieldConfig[] = [
    {
      key: 'Static',
      type: 'checkbox',
      defaultValue: true,
      props: {
        label: 'Keep the same output',
        required: false,
      },
    },
    {
      key: 'Append',
      type: 'checkbox',
      defaultValue: false,
      props: {
        label: 'Append instead of overwrite?',
        required: false,
      },
    },
    {
      key: 'Type',
      type: 'select',
      defaultValue: 'paragraphs',
      props: {
        okText: 'Ok',
        cancelText: 'Stop',
        label: 'What are we generating',
        required: false,
        options: [
          { label: 'Words', value: 'words' },
          { label: 'Sentences', value: 'sentences' },
          { label: 'Paragraphs', value: 'paragraphs' },
        ],
      },
    },
    {
      key: 'Amount',
      type: 'number',
      defaultValue: 3,
      props: {
        label: 'How much',
        required: false,
      },
    },
  ];

  private Lorem = new LoremIpsum({});

  private LoremValue?: string = undefined;
  private LastSettingState?: string = undefined;

  public override Run(Input: SilverLinkData): SilverLinkData {
    let original: string | undefined = undefined;

    if (this.Settings.Append) {
      if (Input.DataFields.length > 0 && Input.DataFields[0].Text !== undefined) {
        original = Input.DataFields[0].Text;
      }
    }

    if (this.Settings.Static) {
      const settingsState = JSON.stringify(this.Settings);

      if (this.LoremValue && settingsState === this.LastSettingState) {
        return new SilverLinkData(JoinedString(original, this.LoremValue, '\n'));
      }

      this.LastSettingState = settingsState;
    }

    switch (this.Settings.Type) {
      case 'words':
        this.LoremValue = this.addParagraphBreaks(this.Lorem.generateWords(this.Settings.Amount));
        break;
      case 'sentences':
        this.LoremValue = this.addParagraphBreaks(this.Lorem.generateSentences(this.Settings.Amount));
        break;
      case 'paragraphs':
        this.LoremValue = this.addParagraphBreaks(this.Lorem.generateParagraphs(this.Settings.Amount));
        break;
    }

    return new SilverLinkData(JoinedString(original, this.LoremValue, '\n'));
  }
  public override New(): SilverLink {
    return new LorempIpsumLink();
  }

  private addParagraphBreaks(text: string): string {
    return text.replace(/(?<!\n)\n(?!\n)/g, '\n\n');
  }
}
