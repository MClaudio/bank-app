import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../../../../environments/environment';
import { GlobalErrorHandler } from '../../../core/services/global-error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private _api: string;

  /**
   * @description
   * Constructor
   *
   * @param {HttpClient} _http - HttpClient
   */
  constructor(private _http: HttpClient) {
    this._api = environment.api;
  }

  /**
   * @description
   * Get products from API.
   *
   * @returns {Observable<Product[]>} Observable of products
   */
  public getProducts(): Observable<Product[]> {
    return this._http
      .get<Product[]>(`${this._api}/products`)
      .pipe(
        map((response: any) => response.data),
        //catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  /**
   * @description
   * Get product by ID from API.
   *
   * @param {string} id - Product ID
   * @returns {Observable<Product>} Observable of product
   */
  public getProduct(id: string): Observable<Product> {
    return this._http
      .get<Product>(`${this._api}/products/${id}`)
      .pipe(map((response: any) => response));
  }

  /**
   * @description
   * Create product in API.
   *
   * @param {Product} product - Product
   * @returns {Observable<Product>} Observable of product
   */
  public createProduct(product: Product): Observable<Product> {
    return this._http
      .post<Product>(`${this._api}/products`, product)
      .pipe(map((response: any) => response.data));
  }

  /**
   * @description
   * Update product in API.
   *
   * @param {Product} product - Product
   * @returns {Observable<Product>} Observable of product
   */
  public updateProduct(product: Product): Observable<Product> {
    return this._http
      .put<Product>(`${this._api}/products/${product.id}`, product)
      .pipe(map((response: any) => response.data));
  }

  /**
   * @description
   * Delete product by ID in API.
   *
   * @param {string} id - Product ID
   * @returns {Observable<any>} Observable of any
   */
  public deleteProduct(id: string): Observable<any> {
    return this._http.delete<any>(`${this._api}/products/${id}`);
  }
}
