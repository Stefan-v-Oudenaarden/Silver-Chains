import { Component, effect, inject, OnInit, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonButtons, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonNote } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveSharp } from 'ionicons/icons';
import { ChainLocalStorageService, StoredChain } from 'src/services/chain-storage.service';
import { LinkChainService } from 'src/services/linkchain.service';

@Component({
  selector: 'app-save-chain',
  templateUrl: './save-chain.component.html',
  styleUrls: ['./save-chain.component.scss'],
  imports: [IonIcon, IonButtons, IonInput, IonNote, IonLabel, IonItem, IonList, IonButton, IonContent, FormsModule],
})
export class SaveChainComponent implements OnInit {
  public ChainChanged = output<void>();
  public StoredChainName = signal<string>('');

  private inputElement = viewChild<IonInput>('inputElement');

  private LinkChainService = inject(LinkChainService);
  private chainLocalStorageService = inject(ChainLocalStorageService);

  public storedChains = this.chainLocalStorageService.StoredChains;

  constructor() {
    addIcons({ saveSharp });

    effect(() => {
      const input = this.inputElement();

      if (input) {
        setTimeout(() => {
          input.setFocus();
        }, 250);
      }
    });
  }

  ngOnInit() {}

  removeChain(chain: StoredChain) {
    let storedChains = this.storedChains().filter((c) => c !== chain);

    this.storedChains.set(storedChains);
  }

  storeChain() {
    let name = this.StoredChainName();
    if (!name) {
      name = 'Saved Chain';
    }

    const links = this.LinkChainService.ExportChain();
    let Item: StoredChain = {
      Name: name,
      Description: this.LinkChainService.ChainTitle(),
      Links: links,
    };

    let storedChains = this.storedChains();
    this.StoredChainName.set('');
    this.storedChains.set([Item].concat(storedChains));
  }

  ImportChain(chain: StoredChain) {
    this.LinkChainService.ImportChain(chain.Links);
    this.ChainChanged.emit();
  }
}
