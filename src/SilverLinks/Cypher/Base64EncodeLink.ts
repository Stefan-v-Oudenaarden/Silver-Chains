import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';

export class ToBase64Link extends BasicSilverLink {
  override Name = 'To Base64';
  override Category = 'Cypher';
  override Description = `Transforms text into a base64 encoded string. `;

  public override PerTextOperation(Text: string): string {
    return btoa(Text);
  }
  public override New(): SilverLink {
    return new ToBase64Link();
  }
}

export class FromBase64Link extends BasicSilverLink {
  override Name = 'From Base64';
  override Category = 'Cypher';
  override Description = `Undoes a transformation into base64 encoded string`;

  public override PerTextOperation(Text: string): string {
    return atob(Text);
  }
  public override New(): SilverLink {
    return new FromBase64Link();
  }
}
