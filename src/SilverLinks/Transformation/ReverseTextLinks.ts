import { signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilverLink } from 'src/services/links.service';
import { BasicSilverLink } from '../BaseLinkImplementation';

export class ReverseTextLink extends BasicSilverLink {
  override Name = 'Reverse';
  override Category = 'Transformation';
  override Description = `Reverses the text. 
  
  **Input**: A sample sentence.   
  **Output**: .ecnetnes elpmas A`;

  public override PerTextOperation(Text: string): string {
    return Text.split('').reverse().join('');
  }
  public override New(): SilverLink {
    return new ReverseTextLink();
  }
}

export class ReverseLinesLink extends BasicSilverLink {
  override Name = 'Reverse Lines';
  override Category = 'Transformation';
  override Description = `Reverses the line order in a text. 
  
  **Input**: 

  A series.

Of Example

Lines.

**Output**: 
    
Lines.

Of Example

A series.`;

  public override PerTextOperation(Text: string): string {
    return Text.split('\n').reverse().join('\n');
  }
  public override New(): SilverLink {
    return new ReverseLinesLink();
  }
}
