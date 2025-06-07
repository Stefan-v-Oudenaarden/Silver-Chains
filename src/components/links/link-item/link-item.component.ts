import { Component, input, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { SilverLink } from 'src/services/links.service';

@Component({
  selector: 'app-link-item',
  templateUrl: './link-item.component.html',
  styleUrls: ['./link-item.component.scss'],
  imports: [NgClass],
})
export class LinkItemComponent implements OnInit {
  public Link = input.required<SilverLink>();
  public IsInteractive = input<boolean>(false);

  constructor() {}

  ngOnInit() {}
}
