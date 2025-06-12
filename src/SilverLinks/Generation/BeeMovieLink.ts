import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink, SilverLinkData } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';
import { CustomSilverLink } from '../CustomSilverLinks';

export class BeeMovieLink extends CustomSilverLink {
  override Name = 'Bee Movie';
  override Category = 'Generation';
  override Description = `Replaces the text with the first 15 lines of the Bee movie script. 
   
  Can optionally append the script instead.`;

  override HasSettings = true;
  override ShowSettings = signal<boolean>(false);

  override Settings: { Append: boolean } = { Append: false };
  override SettingsFormOptions = undefined;
  override SettingsForm: FormlyFieldConfig[] = [
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

  private BeeMovie = `According to all known laws of aviation, there is no way a bee should be able to fly.
Its wings are too small to get its fat little body off the ground.
The bee, of course, flies anyway because bees don't care what humans think is impossible.
Yellow, black. Yellow, black. Yellow, black. Yellow, black.
Ooh, black and yellow!
Let's shake it up a little.
Barry! Breakfast is ready!
Coming!
Hang on a second.
Hello?
Barry?
Adam?
Can you believe this is happening?
I can't.
I'll pick you up.
Looking sharp.
Use the stairs, Your father paid good money for those.
Sorry. I'm excited.
Here's the graduate.
We're very proud of you, son.
A perfect report card, all B's.
Very proud.
Ma! I got a thing going here.
You got lint on your fuzz.
Ow! That's me!`;

  public override Run(Input: SilverLinkData): SilverLinkData {
    if (this.Settings.Append) {
      let original = '';

      if (Input.DataFields.length > 0 && Input.DataFields[0].Text !== undefined) {
        original = Input.DataFields[0].Text;
      }
      return new SilverLinkData([original, this.BeeMovie].join('\n'));
    }

    return new SilverLinkData(this.BeeMovie);
  }

  public override New(): SilverLink {
    return new BeeMovieLink();
  }
}
