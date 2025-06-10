import { Component, computed, input, OnInit } from '@angular/core';
import { IonTextarea, IonButton, IonButtons, IonSpinner, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { copySharp, exitSharp } from 'ionicons/icons';
import { SilverLinkData } from 'src/services/links.service';

@Component({
  selector: 'app-output-panel',
  templateUrl: './output-panel.component.html',
  styleUrls: ['./output-panel.component.scss'],
  imports: [IonIcon, IonButtons, IonButton, IonTextarea],
})
export class OutputPanelComponent implements OnInit {
  public SilverChainOutput = input<SilverLinkData>();
  public DisplayOutput = computed(() => {
    const data = this.SilverChainOutput();
    if (!data || !data.TextData || data.TextData.length == 0) {
      return '';
    }

    for (const element of data.TextData) {
      if (element.Text !== undefined) {
        return element.Text;
      }
    }

    return '';
  });

  constructor() {
    addIcons({ copySharp, exitSharp });
  }

  ngOnInit() {}

  public async CopyText() {
    try {
      await navigator.clipboard.writeText(this.DisplayOutput() || '');
    } catch (error: any) {
      console.error(error.message);
    }
  }

  public async saveOutputToFile() {
    const suggestedFilename = this.generateFilenameWithDateTime('silver chains');
    let fileName = prompt('Enter filename:', suggestedFilename);

    if (!fileName) {
      return;
    }

    const content = this.DisplayOutput() || '';

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();

    window.URL.revokeObjectURL(url);
    link.remove();
  }

  private generateFilenameWithDateTime(baseName: string): string {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    return `${baseName} ${day}-${month}-${year} ${hours}-${minutes}.txt`;
  }
}
