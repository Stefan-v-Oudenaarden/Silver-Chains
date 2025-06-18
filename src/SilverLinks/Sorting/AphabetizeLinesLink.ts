import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';
import { ArrayShuffle } from 'src/app/helpers';

export class AlphabetizeLinesLink extends BasicSilverLink {
  override Name = 'Alphabetize Lines';
  override Category = 'Sorting';
  override Description = `Sorts the lines of the text in alphabetical order. `;

  public override PerTextOperation(Text: string): string {
    return ArrayShuffle(Text.split('\n'))
      .sort((a, b) => a.localeCompare(b))
      .join('\n');
  }
  public override New(): SilverLink {
    return new AlphabetizeLinesLink();
  }
}
