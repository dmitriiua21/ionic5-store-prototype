import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IProduct } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _apiURL = '/assets/data.json';

  constructor(private http: HttpClient) { }

  getProductList(): Observable<IProduct[]> {
    return this.http.get(this._apiURL).pipe(
      map((response: IProduct[]) => response),
      catchError(this.handleError)
    );
  }

  getProduct(sku: number): Observable<IProduct> {
    return this.getProductList().pipe(
      map((products: IProduct[]) => products.find((product: IProduct) => product.sku === sku))
    );
  }

  private handleError(error: any) {
    console.error(error.error || error.body.error);
    return throwError(error.error || error.body.error);
  }
}
