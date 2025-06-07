import { Component, input, OnInit } from '@angular/core';
import { IonTextarea } from '@ionic/angular/standalone';

@Component({
  selector: 'app-output-panel',
  templateUrl: './output-panel.component.html',
  styleUrls: ['./output-panel.component.scss'],
  imports: [IonTextarea],
})
export class OutputPanelComponent implements OnInit {
  public SilverChainOutput = input<string>();

  constructor() {}

  ngOnInit() {}
}
