import { Component, computed, ElementRef, inject, input, OnInit, viewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IonButton, IonButtons, IonIcon, IonTextarea } from '@ionic/angular/standalone';
import { MarkdownComponent } from 'ngx-markdown';
import { addIcons } from 'ionicons';
import { copySharp, exitSharp } from 'ionicons/icons';
import { SilverLinkData } from 'src/services/links.service';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

import { SimpleTableComponent } from 'src/components/simple-table/simple-table.component';

@Component({
  selector: 'app-output-panel',
  templateUrl: './output-panel.component.html',
  styleUrls: ['./output-panel.component.scss'],
  imports: [IonIcon, IonButtons, IonButton, IonTextarea, MarkdownComponent, NgxJsonViewerModule, SimpleTableComponent],
})
export class OutputPanelComponent implements OnInit {
  public SilverChainOutput = input<SilverLinkData>();

  public DomSanitizer = inject(DomSanitizer);

  public exportElement = viewChild<ElementRef<HTMLDivElement>>('outputElement');

  public IsSimpleTextOutput = computed(() => {
    const data = this.SilverChainOutput();

    if (!data || !data.DataFields || data.DataFields.length == 0) {
      return false;
    }

    const dataTypes = Object.keys(data.DataFields[0]);

    return data.DataFields.length === 1 && dataTypes.length == 1 && dataTypes.includes('Text');
  });

  public TextOutput = computed(() => {
    const data = this.SilverChainOutput();
    if (!data || !data.DataFields || data.DataFields.length == 0) {
      return '';
    }

    for (const element of data.DataFields) {
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
      let text = '';
      if (this.IsSimpleTextOutput()) {
        console.log('copy');
        text = this.TextOutput();
      } else {
        const element = document.getElementById('multi-output-content');
        if (element) {
          text = element.textContent || '';
          console.log(text);
        }
      }

      await navigator.clipboard.writeText(text);
    } catch (error: any) {
      console.error(error.message);
    }
  }

  public async saveOutputToFile() {
    let extension = 'txt';

    const suggestedFilename = this.generateFilenameWithDateTime('silver chains', extension);
    let fileName = prompt('Enter filename:', suggestedFilename);

    if (!fileName) {
      return;
    }

    let blob: Blob;

    if (this.IsSimpleTextOutput()) {
      blob = this.ExportAsTextOutput();
    } else {
      blob = this.ExportComplexTextOutout();
    }

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();

    window.URL.revokeObjectURL(url);
    link.remove();
  }

  private ExportAsTextOutput(): Blob {
    const content = this.TextOutput() || '';

    return new Blob([content], { type: 'text/plain' });
  }

  private ExportComplexTextOutout(): Blob {
    const element = document.getElementById('multi-output-content');
    if (element) {
      return new Blob([element.textContent || ''], { type: 'text/plain' });
    }

    return new Blob([''], { type: 'text/plain' });
  }

  private generateFilenameWithDateTime(baseName: string, extension: string = '.text'): string {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    return `${baseName} ${day}-${month}-${year} ${hours}-${minutes}.${extension}`;
  }

  public ConvertSafeHtml(htmlString: string): SafeHtml {
    return this.DomSanitizer.bypassSecurityTrustHtml(htmlString);
  }
}
