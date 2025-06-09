import { input, signal, Signal } from '@angular/core';
import { SilverLink } from 'src/services/links.service';
import { v4 as uuidv4 } from 'uuid';

export class ToLowerCaseLink implements SilverLink {
  public Error = signal<boolean>(false);
  public Output = signal<string>('');
  public Disabled = signal<boolean>(false);

  public Id: string = uuidv4();
  public Name: string = 'To Lower Case';
  public Description: string = 'Turns the input into lower case.';

  public HasSettings: boolean = true;
  public ShowSettingsByDefault: boolean = true;

  public Parse(Input: string): string {
    let result = Input.toLocaleLowerCase();
    return result;
  }

  public New(): SilverLink {
    return new ToLowerCaseLink();
  }
}

export class ToUpperCaseLink implements SilverLink {
  public Error = signal<boolean>(false);
  public Output = signal<string>('');
  public Disabled = signal<boolean>(false);

  public Id: string = uuidv4();
  public Name: string = 'To Upper Case';
  public Description: string = 'Turns the input into ALLCAPS.';

  public HasSettings: boolean = true;
  public ShowSettingsByDefault: boolean = true;

  public Parse(Input: string): string {
    let result = Input.toLocaleUpperCase();
    return result;
  }

  public New(): SilverLink {
    return new ToUpperCaseLink();
  }
}

export class TrimTextLink implements SilverLink {
  public Error = signal<boolean>(false);
  public Output = signal<string>('');
  public Disabled = signal<boolean>(false);

  public Id: string = uuidv4();
  public Name: string = 'Trim Whitespace';
  public Description: string = 'Trim Whitespace';

  public HasSettings: boolean = true;
  public ShowSettingsByDefault: boolean = true;

  public Parse(Input: string): string {
    let result = Input.trim();
    return result;
  }

  public New(): SilverLink {
    return new TrimTextLink();
  }
}
