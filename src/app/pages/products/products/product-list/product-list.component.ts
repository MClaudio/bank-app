import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../../../core/interfaces/product';
import { ProductService } from '../../../../services/product.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { NotificationService } from '../../../../services/notification.service';
import { ModalService } from '../../../../services/modal.service';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit, OnDestroy {
  public products: Product[] = [];
  private _products: Product[] = [];
  private _subscription?: Subscription;
  public search: string = '';
  public size: number = 5;

  constructor(
    private _productService: ProductService,
    private _notificationService: NotificationService,
    private _modalService: ModalService,
    private _loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

  /**
   * @description
   * Loads the products from the API.
   *
   * @returns
   */
  private async loadProducts() {
    try {
      this._loaderService.showLoader();
      let resp: Product[] = await firstValueFrom(
        this._productService.getProducts()
      );
      this._products = resp;
      this.products = this._products.slice(0, this.size);
      this._loaderService.offLoader();
    } catch (error: any) {
      this._loaderService.offLoader();
      this._modalService.openModal(
        'error',
        'Error',
        error?.error?.message || error?.message || JSON.parse(error)
      );
    }
  }

  /**
   * @description
   * Deletes a product from the API.
   *
   * @param {Product} product - Product
   * @returns
   */
  public async deleteProduct(product: Product) {
    try {
      this._modalService.openModal(
        'error',
        '',
        '¿Estas seguro de eliminar el producto ' + product.name + '?',
        true
      );

      this._subscription = this._modalService.eventOnOk.subscribe(
        async (isOk: boolean) => {
          if (isOk) {
            let resp = await firstValueFrom(
              this._productService.deleteProduct(product.id as string)
            );
            this._notificationService.showSuccess('Producto eliminado');
            this.products = this.products.filter(
              (item: Product) => item.id !== product.id
            );
          }
        }
      );
    } catch (error: any) {
      this._modalService.openModal(
        'error',
        'Error',
        error?.error?.message || error?.message || JSON.parse(error)
      );
    }
  }

  public get length() {
    return this.products.length;
  }

  public onChangeSize(_products: Product[] = this._products) {
    this.products = _products.slice(0, this.size);
  }

  public onSearch() {
    if (!this.search || this.search === '') {
      this.products = this._products;
      this.onChangeSize();
      return;
    }
    this.products = this._products.filter(
      (product: Product) =>
        product?.id?.toLowerCase().includes(this.search.toLowerCase()) ||
        product?.name?.toLowerCase().includes(this.search.toLowerCase()) ||
        product?.description?.toLowerCase().includes(this.search.toLowerCase())
    );
    this.onChangeSize(this.products);
  }
}
