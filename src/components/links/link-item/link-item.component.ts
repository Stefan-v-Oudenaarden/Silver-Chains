import { Component, computed, input, linkedSignal, OnInit, output, signal } from '@angular/core';

import { SilverLink } from 'src/services/links.service';
import { GetCssVariableFromDocument } from 'src/app/helpers';
import { IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { trashSharp, eyeOffSharp, eyeSharp, chevronUpSharp, chevronDownSharp } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-link-item',
  templateUrl: './link-item.component.html',
  styleUrls: ['./link-item.component.scss'],
  imports: [IonIcon, IonButton, IonButtons],
  host: {
    '[style.--component-background-color]': 'backgroundColor()',
  },
})
export class LinkItemComponent implements OnInit {
  //Component IO
  public Link = input.required<SilverLink>();
  public IsInteractive = input<boolean>(false);

  public TrashLink = output<void>();

  private backgroundColor = computed(() => {
    const link = this.Link();
    if (link === undefined) {
      return GetCssVariableFromDocument('ion-color-warning-tint');
    }

    if (this.IsInteractive()) {
      if (!link.Disabled()) {
        return GetCssVariableFromDocument('ion-color-success-tint');
      } else {
        return GetCssVariableFromDocument('ion-color-light-tint');
      }
    }

    return GetCssVariableFromDocument('ion-color-light-tint');
  });

  public SettingsVisible = linkedSignal(() => {
    return this.Link().ShowSettingsByDefault;
  });

  constructor() {
    addIcons({ trashSharp, eyeOffSharp, eyeSharp, chevronUpSharp, chevronDownSharp });
  }

  ngOnInit() {}

  ToggleLinkActive(event: MouseEvent) {
    this.Link().Disabled.set(!this.Link().Disabled());
  }

  ToggleSettings(event: MouseEvent) {
    this.SettingsVisible.set(!this.SettingsVisible());
  }

  TrashClick(event: MouseEvent) {
    this.TrashLink.emit();
  }
}
