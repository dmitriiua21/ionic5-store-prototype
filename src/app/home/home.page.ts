import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonSearchbar } from '@ionic/angular';
import { combineLatest, from, merge, Observable } from 'rxjs';
import { filter, map, startWith, switchMap } from 'rxjs/operators';
import { ApiService, IProduct, StorageService } from '../core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild(IonSearchbar, { static: true }) searchbar: IonSearchbar;
  public items$: Observable<IProduct[]>;

  private readonly STORAGE_KEY: string = 'filter';

  constructor(private api: ApiService,
              private storage: StorageService,
              private router: Router) { }

  ngOnInit(): void {
    this.getProducts()
    this.checkRefresh()
  }

  getProducts() {
    const batteries$ = this.api.getProductList();
    const cacheValue$ = from(this.getFilterValue()).pipe(filter(i => !!i));
    const filter$ = this.searchbar.ionChange.pipe(
      map(event => from(this.saveFilterValue(event))),
      switchMap(value => value),
      startWith('')
    );

    this.items$ = combineLatest([batteries$, merge(cacheValue$, filter$)]).pipe(
      map(([batteries, filter]) => batteries.filter(battery => battery.name.toLowerCase().includes(filter.toLowerCase())))
    );
  }

  trackByFn(index: number, item: IProduct) {
    return item.sku;
  }

  private async saveFilterValue(event: Event): Promise<string> {
    const value: string = (event.target as HTMLInputElement).value;
    await this.storage.setValue(this.STORAGE_KEY, value);
    return value;
  }

  private async getFilterValue(): Promise<string> {
    return await this.storage.getValue(this.STORAGE_KEY);
  }

  private checkRefresh() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(async (event: NavigationEnd) => {
        if (event.id === 1 && event.url === event.urlAfterRedirects) {
          this.searchbar.value = await this.getFilterValue();
        }
    });
  }

}
