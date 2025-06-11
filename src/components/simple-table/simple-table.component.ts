import { NgClass } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';

export type SimpleDataColumn = {
  Size?: number;
  Text: string;
};

export type SimpleTableDataRow = {
  Header?: boolean;
  Justification?: 'start' | 'center' | 'between' | 'around' | 'end';
  Columns: SimpleDataColumn[];
};

export type SimpleTableData = {
  Rows: SimpleTableDataRow[];
};

@Component({
  selector: 'app-simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.scss'],
  imports: [IonCol, IonRow, IonGrid, NgClass],
})
export class SimpleTableComponent implements OnInit {
  TableData = input.required<SimpleTableData>();

  constructor() {}

  ngOnInit() {}

  ToJustificationClass(input: string | undefined) {
    if (input === undefined) {
      return '';
    }

    return 'ion-justify-content-' + input;
  }
}
