import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink, SilverLinkData } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';
import { CustomSilverLink } from '../CustomSilverLinks';
import { LoremIpsum } from 'lorem-ipsum';

export class LorempIpsumLink extends CustomSilverLink {
  override Name = 'Lorem Ipsum';
  override Category = 'Generation';
  override Description = `Generates Lorem Ipsum text. 
  Because sometimes you need that.`;

  override HasSettings = true;
  override ShowSettings = signal<boolean>(true);

  override Settings: { Static: boolean; Type: string; Amount: number } = { Static: false, Type: 'paragraphs', Amount: 3 };
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
      fieldGroupClassName: 'formly-display-flex',
      fieldGroup: [
        {
          className: 'formly-flex-1',
          key: 'Type',
          type: 'select',
          defaultValue: 'paragraphs',
          props: {
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
          className: 'formly-flex-1',
          key: 'Amount',
          type: 'number',
          defaultValue: 3,
          props: {
            label: 'How much',
            required: false,
          },
        },
      ],
    },
  ];

  private Lorem = new LoremIpsum({});

  private LoremValue?: string = '';

  public override Run(Input: SilverLinkData): SilverLinkData {
    if (this.Settings.Static) {
      if (this.LoremValue) {
        return new SilverLinkData(this.LoremValue);
      }
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

    return new SilverLinkData(this.LoremValue);
  }
  public override New(): SilverLink {
    return new LorempIpsumLink();
  }

  private addParagraphBreaks(text: string): string {
    return text.replace(/(?<!\n)\n(?!\n)/g, '\n\n');
  }
}
