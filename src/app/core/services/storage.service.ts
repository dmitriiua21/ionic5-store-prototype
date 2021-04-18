import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { }

  async init() {
    await this.storage.create();
  }

  async setValue(key: string, value: string) {
    await this.storage.set(key, value);
  }

  async getValue(key: string): Promise<string> {
    return await this.storage.get(key);
  }

}
