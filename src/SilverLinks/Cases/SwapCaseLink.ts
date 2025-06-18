import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';

export class SwapCaseLink extends BasicSilverLink {
  override Name = 'Swap Cases';
  override Category = 'Cases';
  override Description = `Turns upper case letters into lowercase and vice versa.`;

  public override PerTextOperation(Text: string): string {
    return this.swapCase(Text);
  }

  public override New(): SilverLink {
    return new SwapCaseLink();
  }

  private swapCase(input: string) {
    let result = '';
    for (const char of input) {
      const lower = char.toLocaleLowerCase();
      result += char === lower ? char.toLocaleUpperCase() : lower;
    }
    return result;
  }
}
