import { effect, inject, Injectable, signal } from '@angular/core';
import { SavedLinkChainLink } from './linkchain.service';
import { LocalStorageService } from './storage.service';

export type StoredChain = {
  Name: string;
  Description: string;

  Links: string;
};

@Injectable({
  providedIn: 'root',
})
export class ChainLocalStorageService {
  public StoredChains = signal<StoredChain[]>([]);

  private storageKey: string = 'StoredChains';
  private storageService = inject(LocalStorageService);

  constructor() {
    try {
      let storedChains = this.storageService.getItemWithDefault<StoredChain[]>(this.storageKey, []);
      this.StoredChains.set(storedChains);
    } catch (error: any) {
      console.error('Failed to load Chains from Localstorage', error);
    }

    effect(() => {
      const storedChains = this.StoredChains();
      this.storageService.setItem<StoredChain[]>(this.storageKey, storedChains);
    });
  }
}
