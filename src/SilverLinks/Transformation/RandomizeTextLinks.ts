import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';
import { ArrayShuffle } from 'src/app/helpers';

export class RandomizeTextLink extends BasicSilverLink {
  override Name = 'Randomize';
  override Category = 'Transformation';
  override Description = `Randomizes the text. 
  
  **Input**: A sample sentence.   
  **Output**: lemeAnasnsc e.pte`;

  public override PerTextOperation(Text: string): string {
    return ArrayShuffle(Text.split('')).join('');
  }
  public override New(): SilverLink {
    return new RandomizeTextLink();
  }
}

export class RandomizeLinesLink extends BasicSilverLink {
  override Name = 'Randomize Lines';
  override Category = 'Transformation';
  override Description = `Converts text into lower case. 
  
   **Input**: 

  A series.

Of Example

Lines.

**Output**: 
    
Lines.

A series.

Of Example`;

  public override PerTextOperation(Text: string): string {
    return ArrayShuffle(Text.split('\n')).join('\n');
  }
  public override New(): SilverLink {
    return new RandomizeLinesLink();
  }
}
