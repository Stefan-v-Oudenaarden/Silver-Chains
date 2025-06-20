import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';
import sparkMD5 from 'spark-md5';

export class ToMd5HashLink extends BasicSilverLink {
  override Name = 'To MD5';
  override Category = 'Cypher';
  override Description = `Produces an MD5 hash of the text. `;

  public override PerTextOperation(Text: string): string {
    let hash = sparkMD5.hash(Text);
    return encodeURIComponent(hash);
  }
  public override New(): SilverLink {
    return new ToMd5HashLink();
  }
}
