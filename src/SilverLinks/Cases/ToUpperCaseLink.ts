import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';

export class ToUpperCaseLink extends BasicSilverLink {
  override Name = 'To Upper Case';
  override Category = 'Cases';
  override Description = `Converts text into upper case. 
  
  **Input**: A sentence with SOME Upper Case letters.  
  **Output**: A SENTENCE WITH SOME UPPER CASE LETTERS.`;

  public override PerTextOperation(Text: string): string {
    return Text.toLocaleUpperCase();
  }
  public override New(): SilverLink {
    return new ToUpperCaseLink();
  }
}
