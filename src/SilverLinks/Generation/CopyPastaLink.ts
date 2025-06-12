import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink, SilverLinkData } from 'src/services/links.service';
import { CustomSilverLink } from '../CustomSilverLinks';
import * as Copypastas from './CopyPastaTextcollection';

export class CopyPastaLink extends CustomSilverLink {
  override Name = 'Copypastas';
  override Category = 'Generation';
  override Description = `Replaces or appends text with various popular internet copypastas.`;

  override HasSettings = true;
  override ShowSettings = signal<boolean>(true);

  override Settings: {
    Append: boolean;
    SelectedCopypasta: string;
  } = {
    Append: false,
    SelectedCopypasta: 'BeeMovie',
  };

  override SettingsFormOptions = undefined;
  override SettingsForm: FormlyFieldConfig[] = [
    {
      key: 'SelectedCopypasta',
      type: 'select',
      defaultValue: 'BeeMovie',
      props: {
        label: 'Select Copypasta',
        required: true,
        options: [
          { value: 'BeeMovie', label: 'Bee Movie Script' },
          { value: 'NavySeal', label: 'Navy Seal' },
          { value: 'AmongUs', label: 'Among Us Sus' },
          { value: 'ToBeOrNotToBe', label: "Shakespeare's Hamlet" },
          { value: 'FlyingLotus', label: 'Flying Lotus Grocery Store' },
          { value: 'PenguinOfDoom', label: 'Penguin of Doom' },
          { value: 'GordonRamsay', label: 'Gordon Ramsay Code Review' },
          { value: 'ChuckNorris', label: 'Chuck Norris Programming' },
          { value: 'ModernProblems', label: 'Back in My Day (Programming)' },
        ],
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
  ];

  public override Run(Input: SilverLinkData): SilverLinkData {
    const selectedText = this.getCopypastaText(this.Settings.SelectedCopypasta);

    if (this.Settings.Append) {
      let original = '';

      if (Input.DataFields.length > 0 && Input.DataFields[0].Text !== undefined) {
        original = Input.DataFields[0].Text;
      }
      return new SilverLinkData([original, selectedText].join('\n\n'));
    }

    return new SilverLinkData(selectedText);
  }

  private getCopypastaText(key: string): string {
    switch (key) {
      case 'BeeMovie':
        return Copypastas.BeeMovie;
      case 'NavySeal':
        return Copypastas.NavySeal;
      case 'AmongUs':
        return Copypastas.AmongUs;
      case 'ToBeOrNotToBe':
        return Copypastas.ToBeOrNotToBe;
      case 'FlyingLotus':
        return Copypastas.FlyingLotus;
      case 'PenguinOfDoom':
        return Copypastas.PenguinOfDoom;
      case 'GordonRamsay':
        return Copypastas.GordonRamsay;
      case 'ChuckNorris':
        return Copypastas.ChuckNorris;
      case 'ModernProblems':
        return Copypastas.ModernProblems;
      default:
        return Copypastas.BeeMovie;
    }
  }

  public override New(): SilverLink {
    return new CopyPastaLink();
  }
}
