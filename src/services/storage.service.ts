import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private config: { prefix: string } = { prefix: 'SilverChains-' };

  private getKey(key: string): string {
    return this.config.prefix ? `${this.config.prefix}${key}` : key;
  }

  public setItem<T>(key: string, value: T): boolean {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.getKey(key), serializedValue);
      return true;
    } catch (error) {
      console.error('Error setting localStorage item:', error);
      return false;
    }
  }

  public getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (item === null) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Error getting localStorage item:', error);
      return null;
    }
  }

  public getItemWithDefault<T>(key: string, defaultValue: T): T {
    const value = this.getItem<T>(key);
    return value !== null ? value : defaultValue;
  }

  public removeItem(key: string): boolean {
    try {
      localStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.error('Error removing localStorage item:', error);
      return false;
    }
  }

  public clear(): boolean {
    try {
      if (this.config.prefix) {
        // Only clear items with the specified prefix
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(this.config.prefix)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((key) => localStorage.removeItem(key));
      } else {
        localStorage.clear();
      }
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  public hasItem(key: string): boolean {
    return localStorage.getItem(this.getKey(key)) !== null;
  }

  public getKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        if (this.config.prefix) {
          if (key.startsWith(this.config.prefix)) {
            keys.push(key.substring(this.config.prefix.length));
          }
        } else {
          keys.push(key);
        }
      }
    }
    return keys;
  }
}
