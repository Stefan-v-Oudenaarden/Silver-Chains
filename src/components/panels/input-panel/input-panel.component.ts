import { Component, ElementRef, inject, OnInit, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonTextarea, IonIcon, IonButton, IonButtons, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { copySharp, enterSharp, trashSharp } from 'ionicons/icons';
import { SilverLinkData } from 'src/services/links.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  selector: 'app-input-panel',
  templateUrl: './input-panel.component.html',
  styleUrls: ['./input-panel.component.scss'],
  imports: [IonSpinner, IonButtons, IonButton, IonIcon, IonTextarea, FormsModule],
})
export class InputPanelComponent implements OnInit {
  //Component IO
  public UserInput = output<SilverLinkData>();

  //Services
  private ToastService = inject(ToastService);

  public InputValue = signal<string>(``);
  public LoadingFile = signal<boolean>(false);
  private fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  constructor() {
    addIcons({ copySharp, trashSharp, enterSharp });
  }

  ngOnInit() {
    //     this.InputValue
    //       .set(`Do elit fugiat laborum laborum aliqua Lorem ea aliquip. Occaecat amet non ullamco culpa ullamco ut anim consectetur ullamco proident laborum ut adipisicing incididunt. Id adipisicing culpa esse do nulla aute dolore consectetur quis aute elit. Ad proident consequat dolor dolor voluptate non commodo tempor aute dolor in fugiat.
    // Ut anim consectetur non incididunt culpa incididunt excepteur. Eiusmod dolor elit reprehenderit sint. Veniam nulla quis elit anim amet laboris.
    // Amet minim consequat non duis minim est voluptate duis elit voluptate elit aliquip. Enim aliqua tempor qui sint dolore consectetur sit adipisicing pariatur. Cupidatat tempor mollit est anim veniam duis mollit deserunt deserunt quis dolor anim nisi eiusmod. Consectetur in elit dolor adipisicing aute amet Lorem elit culpa ad aute. Labore sunt non sint qui reprehenderit reprehenderit pariatur officia laborum reprehenderit incididunt. Veniam excepteur et pariatur do aliquip ullamco in velit culpa enim mollit consequat magna eiusmod. Aute deserunt Lorem esse nulla est magna in deserunt eiusmod.`);
    //     this.PushUserInput(this.InputValue());
  }

  public PushUserInput(input: string) {
    this.UserInput.emit(new SilverLinkData(input));
  }

  public onTextAreaInput(event: any) {
    console.log(event);

    const input = event.detail.value;

    if (input === undefined) {
      return;
    }

    this.PushUserInput(input);
  }

  public EmptyInput() {
    this.InputValue.set('');
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
      this.PushUserInput(this.InputValue());

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
