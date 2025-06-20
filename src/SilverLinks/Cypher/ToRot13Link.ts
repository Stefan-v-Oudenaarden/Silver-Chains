import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { signal } from '@angular/core';

export class ToRot13Link extends BasicSilverLink {
  override Name = 'To Rot13';
  override Category = 'Cypher';
  override Description = `Transforms text with the Rot13 cypher. `;

  override HasSettings = true;
  override ShowSettings = signal<boolean>(false);
  override Settings: {
    Rotation: number;
  } = {
    Rotation: 13,
  };

  override SettingsFormOptions = undefined;
  override SettingsForm: FormlyFieldConfig[] = [
    {
      key: 'Rotation',
      type: 'number',
      defaultValue: 13,
      props: {
        label: 'Rotation Number',
        required: false,
      },
    },
  ];

  public override PerTextOperation(Text: string): string {
    return this.Rot(Text, this.Settings.Rotation);
  }

  Rot(text: string, shift: number = 13): string {
    return text.replace(/[A-Za-z]/g, (char: string): string => {
      const isUpperCase = char >= 'A' && char <= 'Z';
      const baseCharCode = isUpperCase ? 65 : 97; // 'A' = 65, 'a' = 97

      const position = char.charCodeAt(0) - baseCharCode;
      const rotatedPosition = (((position + shift) % 26) + 26) % 26;

      return String.fromCharCode(baseCharCode + rotatedPosition);
    });
  }

  public override New(): SilverLink {
    return new ToRot13Link();
  }
}
