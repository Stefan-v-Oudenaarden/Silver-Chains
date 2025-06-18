import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';

export class AlternateCaseLink extends BasicSilverLink {
  override Name = 'Alternate Cases';
  override Category = 'Cases';
  override Description = `Alternate the casing of a text. 
  
  **Input**: A regular sentence with normal words.  
  **Output**: A ReGuLaR SeNtEnCe wItH NoRmAl wOrDs.`;

  public override PerTextOperation(Text: string): string {
    let newText = '';

    for (let i = 0; i < Text.length; i++) {
      if (i % 2 == 0) {
        newText += Text[i].toLocaleUpperCase();
      } else {
        newText += Text[i].toLocaleLowerCase();
      }
    }

    return newText;
  }

  public override New(): SilverLink {
    return new AlternateCaseLink();
  }
}
