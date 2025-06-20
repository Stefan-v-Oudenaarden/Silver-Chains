import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';

const leetSubstitutions: { from: string; to: string }[] = [
  { from: 'a', to: '4' },
  { from: 'e', to: '3' },
  { from: 'g', to: '6' },
  { from: 'a', to: '4' },
  { from: 'l', to: '1' },
  { from: 'o', to: '0' },
  { from: 'l', to: '1' },
  { from: 's', to: '5' },
  { from: 't', to: '7' },
  { from: 'l', to: '1' },
];

export class ToLeetLink extends BasicSilverLink {
  override Name = 'To 1337';
  override Category = 'Cypher';
  override Description = `Applies the 1337 "cypher" to a text. `;

  public override PerTextOperation(Text: string): string {
    return this.toLeet(Text);
  }

  toLeet(text: string) {
    text = text.toLocaleLowerCase();
    for (const sub of leetSubstitutions) {
      text = text.replaceAll(sub.from, sub.to);
    }

    return text;
  }

  public override New(): SilverLink {
    return new ToLeetLink();
  }
}

export class FromLeetLink extends BasicSilverLink {
  override Name = 'From 1337';
  override Category = 'Cypher';
  override Description = `Undoes the appllication of the 1337 "cypher" to a text.`;

  public override PerTextOperation(Text: string): string {
    return this.fromLeet(Text);
  }

  fromLeet(text: string) {
    text = text.toLocaleLowerCase();
    for (const sub of leetSubstitutions) {
      text = text.replaceAll(sub.to, sub.from);
    }
    return text;
  }

  public override New(): SilverLink {
    return new FromLeetLink();
  }
}
