import { Component, computed, effect, input, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { IonButton, IonButtons, IonIcon, IonItem, IonLabel } from '@ionic/angular/standalone';
import { FormlyFieldConfig, FormlyForm, FormlyFormOptions } from '@ngx-formly/core';
import { NgxTooltip } from '@ngx-popovers/tooltip';
import { addIcons } from 'ionicons';
import { chevronDownSharp, chevronUpSharp, eyeOffSharp, eyeSharp, trashSharp } from 'ionicons/icons';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { GetCssVariableFromDocument } from 'src/app/helpers';
import { SilverLink } from 'src/services/links.service';
import { TooltipProvider } from '../link-tooltip/link-tooltip.component';

@Component({
  selector: 'app-link-item',
  templateUrl: './link-item.component.html',
  styleUrls: ['./link-item.component.scss'],
  imports: [IonItem, IonLabel, IonIcon, IonButton, IonButtons, FormlyForm, NgxTooltip],
  providers: [TooltipProvider],
  host: {
    '[style.--component-background-color]': 'backgroundColor()',
    '[style.--component-color]': 'color()',
  },
})
export class LinkItemComponent implements OnInit {
  //Component IO
  public Link = input.required<SilverLink>();
  public IsInteractive = input<boolean>(false);

  public TrashLink = output<void>();
  public TriggerLinkchain = output<void>();

  //Formly form interactivity
  private modelValue = signal('');
  private modelChanges$ = toObservable(this.modelValue).pipe(debounceTime(50), distinctUntilChanged(), takeUntilDestroyed());

  public form = new FormGroup([]);
  public model: any = {};
  public options: FormlyFormOptions = {};

  private providedFields = signal<FormlyFieldConfig[]>([]);
  //Best supported way i found to get callbacks from Formly on value changes. For live updating the output.
  public fields = computed(() => {
    return this.providedFields().map((field) => {
      if (field && field.props) {
        field.props.keydown = () => setTimeout(() => this.modelValue.set(JSON.stringify(this.model)));
        field.props.change = () => setTimeout(() => this.modelValue.set(JSON.stringify(this.model)));
      }

      return field;
    });
  });

  //CSS Variables
  private backgroundColor = computed(() => {
    const link = this.Link();
    if (link === undefined) {
      return GetCssVariableFromDocument('ion-color-warning-tint');
    }

    if (this.IsInteractive()) {
      if (!link.Disabled()) {
        if (link.Error()) {
          return GetCssVariableFromDocument('ion-color-danger');
        } else {
          return GetCssVariableFromDocument('ion-color-success-tint');
        }
      } else {
        return GetCssVariableFromDocument('ion-color-light-tint');
      }
    }

    return GetCssVariableFromDocument('ion-color-light-tint');
  });

  private color = computed(() => {
    const link = this.Link();
    if (link === undefined) {
      return GetCssVariableFromDocument('ion-color-warning-contrast');
    }

    if (this.IsInteractive()) {
      if (!link.Disabled()) {
        if (link.Error()) {
          return GetCssVariableFromDocument('ion-color-danger-contrast');
        } else {
          return GetCssVariableFromDocument('ion-color-success-contrast');
        }
      } else {
        return GetCssVariableFromDocument('ion-color-light-contrast');
      }
    }

    return GetCssVariableFromDocument('ion-color-light-contrast');
  });

  constructor() {
    addIcons({ trashSharp, eyeOffSharp, eyeSharp, chevronUpSharp, chevronDownSharp });
    this.modelChanges$.subscribe(() => {
      if (this.IsInteractive()) {
        this.TriggerLinkchain.emit();
      }
    });

    //Populate the formly fields if this link has Settings
    effect(() => {
      const link = this.Link();

      if (!link.HasSettings) {
        return;
      }

      if (link.SettingsForm) {
        this.providedFields.set(link.SettingsForm);
      } else {
        console.warn('Link has enabled settings but does not have a settings form.', link);
      }

      if (link.Settings) {
        this.model = link.Settings;
      } else {
        console.warn('Link has enabled settings but does not have a settings field.', link);
      }

      if (link.SettingsFormOptions) {
        this.options = link.SettingsFormOptions;
      }
    });
  }

  ngOnInit() {}

  ToggleLinkActive(event: MouseEvent) {
    this.Link().Disabled.set(!this.Link().Disabled());
    this.TriggerLinkchain.emit();
  }

  ToggleSettings(event: MouseEvent) {
    this.Link().ShowSettings.set(!this.Link().ShowSettings());
  }

  TrashClick(event: MouseEvent) {
    this.TrashLink.emit();
  }
}
