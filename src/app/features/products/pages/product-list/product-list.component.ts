import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { firstValueFrom } from 'rxjs';
import { LoaderService } from '../../../../shared/services/loader.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit, OnDestroy {
  public products: Product[] = [];
  private _products: Product[] = [];
  public search: string = '';
  public size: number = 5;

  constructor(
    private readonly _productService: ProductService,
    private readonly _loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {

  }

  /**
   * @description
   * Loads the products from the API.
   *
   * @returns
   */
  private async loadProducts(): Promise<void> {
    this._loaderService.showLoader();
    let resp: Product[] = await firstValueFrom(
      this._productService.getProducts()
    );
    this._products = resp;
    this.products = this._products.slice(0, this.size);
    this._loaderService.offLoader();
  }

  public get length(): number {
    return this.products.length;
  }

  public onChangeSize(_products: Product[] = this._products): void {
    this.products = _products.slice(0, this.size);
  }

  public onSearch(): void {
    const term = this.search.trim().toLowerCase();

    if (!term) {
      this.products = this._products;
    } else {
      this.products = this._products.filter(product =>
        [product.id, product.name, product.description].some(field => field?.toLowerCase().includes(term))
      );
    }

    this.onChangeSize(this.products);
  }
}
