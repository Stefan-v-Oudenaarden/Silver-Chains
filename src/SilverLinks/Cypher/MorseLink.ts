import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';

const morseSubstitutions: { from: string; to: string }[] = [
  { from: 'A', to: '·‐' },
  { from: 'B', to: '‐···' },
  { from: 'C', to: '‐·‐·' },
  { from: 'D', to: '‐··' },
  { from: 'E', to: '·' },
  { from: 'F', to: '··‐·' },
  { from: 'G', to: '‐‐·' },
  { from: 'H', to: '····' },
  { from: 'I', to: '··' },
  { from: 'J', to: '·‐‐‐' },
  { from: 'K', to: '‐·‐' },
  { from: 'L', to: '·‐··' },
  { from: 'M', to: '‐‐' },
  { from: 'N', to: '‐·' },
  { from: 'O', to: '‐‐‐' },
  { from: 'P', to: '·‐‐·' },
  { from: 'Q', to: '‐‐·‐' },
  { from: 'R', to: '·‐·' },
  { from: 'S', to: '···' },
  { from: 'T', to: '‐' },
  { from: 'U', to: '··‐' },
  { from: 'V', to: '···‐' },
  { from: 'W', to: '·‐‐' },
  { from: 'X', to: '‐··‐' },
  { from: 'Y', to: '‐·‐‐' },
  { from: 'Z', to: '‐‐··' },
  { from: '1', to: '·‐‐‐‐' },
  { from: '2', to: '··‐‐‐' },
  { from: '3', to: '···‐‐' },
  { from: '4', to: '····‐' },
  { from: '5', to: '·····' },
  { from: '6', to: '‐····' },
  { from: '7', to: '‐‐···' },
  { from: '8', to: '‐‐‐··' },
  { from: '9', to: '‐‐‐‐·' },
  { from: '0', to: '‐‐‐‐‐' },
  { from: '.', to: '·‐·‐·‐' },
  { from: ',', to: '‐‐··‐‐' },
  { from: ':', to: '‐‐‐···' },
  { from: ';', to: '‐·‐·‐·' },
  { from: '!', to: '‐·‐·‐‐' },
  { from: '?', to: '··‐‐··' },
  { from: "'", to: '·‐‐‐‐·' },
  { from: '"', to: '·‐··‐·' },
  { from: '/', to: '‐··‐·' },
  { from: '-', to: '‐····‐' },
  { from: '+', to: '·‐·‐·' },
  { from: '(', to: '‐·‐‐·' },
  { from: ')', to: '‐·‐‐·‐' },
  { from: '@', to: '·‐‐·‐·' },
  { from: '=', to: '‐···‐' },
  { from: '&', to: '·‐···' },
  { from: '_', to: '··‐‐·‐' },
  { from: '$', to: '···‐··‐' },
];

export class ToMorseLink extends BasicSilverLink {
  override Name = 'To Morse Code';
  override Category = 'Cypher';
  override Description = `A morse code representation of a text. `;

  public override PerTextOperation(Text: string): string {
    return this.toNato(Text);
  }

  toNato(text: string) {
    text = text.toLocaleUpperCase();
    let output = '';

    for (let char of text.split('')) {
      const sub = morseSubstitutions.find((sub) => sub.from === char);
      if (sub) {
        output += sub.to + ' ';
      } else {
        output += char;
      }
    }

    return output;
  }

  public override New(): SilverLink {
    return new ToMorseLink();
  }
}

export class FromMorseLink extends BasicSilverLink {
  override Name = 'From Morse Code';
  override Category = 'Cypher';
  override Description = `Converts morse code back into text.`;

  public override PerTextOperation(Text: string): string {
    let paragraphs = Text.split('\n\n');
    let decodedPargraphs = paragraphs.map((p) => this.fromNato(p));

    return this.fromNato(decodedPargraphs.join('\n\n'));
  }

  fromNato(text: string) {
    let output = '';

    text = text.replace(/-|‐|−|_|–|—|dash/gi, '‐');
    text = text.replace(/\.|·|dot/gi, '·');

    for (let word of text.split(' ')) {
      const sub = morseSubstitutions.find((sub) => sub.to === word);
      if (sub) {
        output += sub.from + '';
      } else {
        output += word + ' ';
      }
    }

    return output;
  }

  public override New(): SilverLink {
    return new FromMorseLink();
  }
}
