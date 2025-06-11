import { Component, computed, OnInit, Provider } from '@angular/core';
import { NGX_TOOLTIP_COMPONENT, TooltipBase } from '@ngx-popovers/tooltip';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-link-tooltip',
  templateUrl: './link-tooltip.component.html',
  styleUrls: ['./link-tooltip.component.scss'],
  imports: [MarkdownComponent],
})
export class LinkTooltipComponent extends TooltipBase implements OnInit {
  public tooltipContent = computed(() => this.text.split('\n'));

  constructor() {
    super();
  }

  ngOnInit() {}
}

export const TooltipProvider: Provider = {
  provide: NGX_TOOLTIP_COMPONENT,
  useValue: LinkTooltipComponent,
};
