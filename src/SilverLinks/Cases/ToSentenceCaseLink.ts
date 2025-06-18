import { toSentenceCase } from 'js-convert-case';
import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';

export class ToSentenceCaseLink extends BasicSilverLink {
  override Name = 'To Sentence Case';
  override Category = 'Cases';
  override Description = `Converts text into upper case. 
  
  **Input**: A sentence with SOME Upper Case letters.  
  **Output**: A sentence with some upper case letters.`;

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
      let newSentence = toSentenceCase(sentences[i]);
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
    return new ToSentenceCaseLink();
  }
}
