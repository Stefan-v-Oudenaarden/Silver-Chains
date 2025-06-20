import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';
import { text } from 'ionicons/icons';

const natoSubstitutions: { from: string; to: string }[] = [
  { from: 'A', to: 'Alpha' },
  { from: 'B', to: 'Bravo' },
  { from: 'C', to: 'Charlie' },
  { from: 'D', to: 'Delta' },
  { from: 'E', to: 'Echo' },
  { from: 'F', to: 'Foxtrot' },
  { from: 'G', to: 'Golf' },
  { from: 'H', to: 'Hotel' },
  { from: 'I', to: 'India' },
  { from: 'J', to: 'Juliet' },
  { from: 'K', to: 'Kilo' },
  { from: 'L', to: 'Lima' },
  { from: 'M', to: 'Mike' },
  { from: 'N', to: 'November' },
  { from: 'O', to: 'Oscar' },
  { from: 'P', to: 'Papa' },
  { from: 'Q', to: 'Quebec' },
  { from: 'R', to: 'Romeo' },
  { from: 'S', to: 'Sierra' },
  { from: 'T', to: 'Tango' },
  { from: 'U', to: 'Uniform' },
  { from: 'V', to: 'Victor' },
  { from: 'W', to: 'Whiskey' },
  { from: 'X', to: 'X-ray' },
  { from: 'Y', to: 'Yankee' },
  { from: 'Z', to: 'Zulu' },
  { from: '0', to: 'Zero' },
  { from: '1', to: 'One' },
  { from: '2', to: 'Two' },
  { from: '3', to: 'Three' },
  { from: '4', to: 'Four' },
  { from: '5', to: 'Five' },
  { from: '6', to: 'Six' },
  { from: '7', to: 'Seven' },
  { from: '8', to: 'Eight' },
  { from: '9', to: 'Nine' },
  { from: '.', to: 'Stop' },
  { from: ',', to: 'Comma' },
  { from: ':', to: 'Colon' },
  { from: ';', to: 'Semi-colon' },
  { from: '!', to: 'Exclamation-mark' },
  { from: '?', to: 'Question mark' },
  { from: "'", to: 'Apostrophe' },
  { from: '"', to: 'Quote' },
  { from: '-', to: 'Hyphen' },
  { from: '/', to: 'Slant' },
  { from: '(', to: 'Brackets-on' },
  { from: ')', to: 'Brackets-off' },
];

export class ToNatoPhoneticLink extends BasicSilverLink {
  override Name = 'To Nato Phonetic';
  override Category = 'Cypher';
  override Description = `The nato phonetic spelling of the given text. `;

  public override PerTextOperation(Text: string): string {
    return this.toNato(Text);
  }

  toNato(text: string) {
    text = text.toLocaleUpperCase();
    let output = '';

    for (let char of text.split('')) {
      const sub = natoSubstitutions.find((sub) => sub.from === char);
      if (sub) {
        output += sub.to + ' ';
      } else {
        output += char;
      }
    }

    return output;
  }

  public override New(): SilverLink {
    return new ToNatoPhoneticLink();
  }
}

export class FromNatoPhoneticLink extends BasicSilverLink {
  override Name = 'From Nato Phonetic';
  override Category = 'Cypher';
  override Description = `Tries to represent nato phonetic spelling as normal text.`;

  public override PerTextOperation(Text: string): string {
    let paragraphs = Text.split('\n\n');
    let decodedPargraphs = paragraphs.map((p) => this.fromNato(p));

    return this.fromNato(decodedPargraphs.join('\n\n'));
  }

  fromNato(text: string) {
    let output = '';

    for (let word of text.split(' ')) {
      const sub = natoSubstitutions.find((sub) => sub.to === word);
      if (sub) {
        output += sub.from + '';
      } else {
        output += word + ' ';
      }
    }

    return output;
  }

  public override New(): SilverLink {
    return new FromNatoPhoneticLink();
  }
}
