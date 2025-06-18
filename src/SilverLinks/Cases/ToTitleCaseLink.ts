import { titleCase } from 'title-case';
import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';

export class ToTitleCaseLink extends BasicSilverLink {
  override Name = 'To Title Case';
  override Category = 'Cases';
  override Description = `Converts text into title case. 
  
  **Input**: A regular sentence with normal words.  
  **Output**: A Regular Sentence with Normal Words.`;

  public override PerTextOperation(Text: string): string {
    var lines = Text.split('\n');
    var sentenceCaseLines = lines.map((line) => {
      if (line.trim()) {
        return this.PerNewLinesOperation(line);
      }
      return line;
    });

    return sentenceCaseLines.join('\n');
  }

  PerNewLinesOperation(Text: string): string {
    var sentences = Text.split(/([\.\!\?][ \n\r]?)/);

    var newSentences: string[] = [];

    for (let i = 0; i < sentences.length; i += 2) {
      let newSentence = titleCase(sentences[i]);
      let interpunctionFrament = sentences[i + 1];
      if (interpunctionFrament === undefined) {
        interpunctionFrament = '';
      }
      newSentences.push(newSentence + interpunctionFrament);
    }

    // return Text;
    return newSentences.join('');
  }

  public override New(): SilverLink {
    return new ToTitleCaseLink();
  }
}
