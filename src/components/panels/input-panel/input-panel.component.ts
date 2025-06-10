import { Component, ElementRef, inject, OnInit, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonTextarea, IonIcon, IonButton, IonButtons, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { copySharp, enterSharp, trashSharp } from 'ionicons/icons';
import { ToastService } from 'src/services/toast.service';

@Component({
  selector: 'app-input-panel',
  templateUrl: './input-panel.component.html',
  styleUrls: ['./input-panel.component.scss'],
  imports: [IonSpinner, IonButtons, IonButton, IonIcon, IonTextarea, FormsModule],
})
export class InputPanelComponent implements OnInit {
  //Component IO
  public UserInput = output<string>();

  //Services
  private ToastService = inject(ToastService);

  public InputValue = signal<string>('');
  public LoadingFile = signal<boolean>(false);
  private fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  constructor() {
    addIcons({ copySharp, trashSharp, enterSharp });
  }

  ngOnInit() {}

  public onTextAreaInput(event: any) {
    const input = event.detail.value;

    if (input === undefined) {
      return;
    }

    this.UserInput.emit(input);
  }

  public EmptyInput() {
    this.InputValue.set('');
    this.UserInput.emit('');
  }

  public async CopyText() {
    try {
      await navigator.clipboard.writeText(this.InputValue());
    } catch (error: any) {
      console.error(error.message);
    }
  }

  public async LoadTextFromFileClick() {
    this.fileInput()?.nativeElement.click();
    this.LoadingFile.set(true);
  }

  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        reject(reader.error || 'Unknown error occurred');
      };

      reader.readAsText(file);
    });
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    try {
      const content = await this.readFileAsText(file);

      this.InputValue.set(content);
      this.UserInput.emit(this.InputValue());

      this.ToastService.showSuccessToast('Loaded file.');
    } catch (err) {
    } finally {
      //Resest the file input element so behaviour remains consistent.
      let fileInputElement = this.fileInput()?.nativeElement;
      if (fileInputElement) {
        fileInputElement.value = '';
      }

      this.LoadingFile.set(false);
    }
  }
}
