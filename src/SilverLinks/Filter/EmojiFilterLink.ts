import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';

export class EmojiFilterLink extends BasicSilverLink {
  override Name = 'Filter Emojis';
  override Category = 'Filtering';
  override Description = `Removes all emoji characters from the text.`;

  public override PerTextOperation(Text: string): string {
    // More comprehensive emoji regex that properly handles all emoji ranges
    const emojiRegex =
      /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud83c[\udde6-\uddff]|[\ud83d[\ude00-\ude4f]|[\ud83d[\ude80-\udeff]|[\ud83c[\udf00-\uffff]|[\ud83e[\udd00-\uddff]|[\ud83e[\ude00-\udeff]|[\ud83e[\udf00-\uffff]|[\ud83c[\udc00-\udcff]|[\ud83d[\udc00-\udcff])/g;

    // Remove emojis from text
    return Text.replace(emojiRegex, '');
  }

  public override New(): SilverLink {
    return new EmojiFilterLink();
  }
}
