import { input, signal, Signal } from '@angular/core';
import { SilverLink } from 'src/services/links.service';
import { v4 as uuidv4 } from 'uuid';

export class BeeMovieLink implements SilverLink {
  public Error = signal<boolean>(false);
  public Output = signal<string>('');

  public Id: string = uuidv4();
  public Name: string = 'Bee Movie';
  public Description: string = 'The first 500 characters of the bee movie script';

  public Parse(Input: string): string {
    let result = `According to all known laws of aviation, there is no way a bee should be able to fly.
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
    return result;
  }

  public New(): SilverLink {
    return new BeeMovieLink();
  }
}
