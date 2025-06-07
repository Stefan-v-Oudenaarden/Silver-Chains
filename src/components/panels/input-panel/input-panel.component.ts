import { Component, OnInit, output } from '@angular/core';
import { IonTextarea } from '@ionic/angular/standalone';

@Component({
  selector: 'app-input-panel',
  templateUrl: './input-panel.component.html',
  styleUrls: ['./input-panel.component.scss'],
  imports: [IonTextarea],
})
export class InputPanelComponent implements OnInit {
  //Component IO
  public UserInput = output<string>();

  constructor() {}

  ngOnInit() {}

  public onTextAreaInput(event: any) {
    const input = event.detail.value;

    if (input === undefined) {
      return;
    }

    this.UserInput.emit(input);
  }
}
