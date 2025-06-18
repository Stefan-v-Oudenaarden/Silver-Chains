import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';

export class ToLowerCaseLink extends BasicSilverLink {
  override Name = 'To Lower Case';
  override Category = 'Cases';
  override Description = `Converts text into lower case. 
  
  **Input**: A sentence with SOME Upper Case letters.   
  **Output**: a sentence with some upper case letters.`;

  public override PerTextOperation(Text: string): string {
    return Text.toLocaleLowerCase();
  }
  public override New(): SilverLink {
    return new ToLowerCaseLink();
  }
}
