import { Component, OnInit } from '@angular/core';
import { StorageService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private storage: StorageService) {}

  async ngOnInit() {
    await this.storage.init();
  }

}
