import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';

export class ToUrlEscapeLink extends BasicSilverLink {
  override Name = 'To UrlEscape';
  override Category = 'Cypher';
  override Description = `Transforms text into a url escaped text. `;

  public override PerTextOperation(Text: string): string {
    return encodeURIComponent(Text);
  }
  public override New(): SilverLink {
    return new ToUrlEscapeLink();
  }
}

export class FromUrlEscapeLink extends BasicSilverLink {
  override Name = 'From UrlEscape';
  override Category = 'Cypher';
  override Description = `Undoes a transformation into a url escaped text`;

  public override PerTextOperation(Text: string): string {
    return decodeURIComponent(Text);
  }
  public override New(): SilverLink {
    return new FromUrlEscapeLink();
  }
}
