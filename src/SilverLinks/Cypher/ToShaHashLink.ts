import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';
import sha256 from '@cryptography/sha256';

export class ToSha256HashLink extends BasicSilverLink {
  override Name = 'To SHA(2) 256';
  override Category = 'Cypher';
  override Description = `Produces an SHA256 hash of the text. `;

  public override PerTextOperation(Text: string): string {
    const hash = sha256(Text, 'hex');
    return hash;
  }

  public override New(): SilverLink {
    return new ToSha256HashLink();
  }
}
