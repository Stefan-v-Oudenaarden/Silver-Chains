import { Component, HostListener, inject } from '@angular/core';
import {
  AngularSplitModule,
  SplitAreaComponent,
  SplitComponent,
} from 'angular-split';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [SplitComponent, SplitAreaComponent],
})
export class HomePage {
  private panelBeingResized?: string = undefined;

  private lastMouseMove?: MouseEvent;
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (this.panelBeingResized === undefined) {
      return;
    }

    if (this.lastMouseMove === undefined) {
      this.lastMouseMove = e;
      return;
    }

    const xDiff = this.lastMouseMove.clientX - e.clientX;
    const yDiff = this.lastMouseMove.clientY - e.clientY;

    console.log({ xDiff, yDiff });
  }

  constructor() {}

  onMouseDown(panel: string) {
    this.panelBeingResized = panel;
    console.log(`Mouse down ${panel}`);
  }

  onMouseUp() {
    if (this.panelBeingResized) {
      console.log('Mouse up');
    }

    this.panelBeingResized = undefined;
    this.lastMouseMove = undefined;
  }
}
