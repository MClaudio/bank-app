import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { firstValueFrom, Subject, Subscription, take, takeUntil } from 'rxjs';
import { NotificationService } from '../../../../shared/services/notification.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { ModalOptions } from '../../../../core/interfaces/modal-options';

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
  public dropdownStates: { [key: string]: boolean } = {};
  private destroy$ = new Subject<void>();

  constructor(
    private readonly _productService: ProductService,
    private readonly _notificationService: NotificationService,
    private readonly _modalService: ModalService,
    private readonly _loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    //this._subscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
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

  /**
   * @description
   * Deletes a product from the API.
   *
   * @param {Product} product - Product
   * @returns
   */
  public async deleteProduct(product: Product) {
    let options: ModalOptions = {
      type: 'error',
      title: '',
      body: '¿Estas seguro de eliminar el producto ' + product.name + '?',
      isDecision: true,
    };
    this._modalService.openModal(options);

    this._modalService.eventOnOk.pipe(
      takeUntil(this.destroy$),
      take(1)
    ).subscribe(async (isOk: boolean) => {
      if (isOk) {
        await firstValueFrom(
          this._productService.deleteProduct(product.id as string)
        );
        this._notificationService.showSuccess('Producto eliminado');
        this.products = this.products.filter(
          (item: Product) => item.id !== product.id
        );
      }
    });
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

  public toggleDropdown(productId: string): void {
    // Cerrar otros dropdowns
    Object.keys(this.dropdownStates).forEach(key => {
      if (key !== productId) {
        this.dropdownStates[key] = false;
      }
    });

    this.dropdownStates[productId] = !this.dropdownStates[productId];
  }

  public onDropdownKeydown(event: KeyboardEvent, productId: string): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        event.preventDefault();
        this.dropdownStates[productId] = true;
        setTimeout(() => {
          const firstMenuItem = document.querySelector(`#dropdown-menu-${productId} a[role="menuitem"]`) as HTMLElement;
          firstMenuItem?.focus();
        });
        break;
      case 'Escape':
        this.dropdownStates[productId] = false;
        break;
    }
  }

  public onMenuItemKeydown(event: KeyboardEvent, itemIndex: number, productId: string): void {
    const menuItems = document.querySelectorAll(`#dropdown-menu-${productId} a[role="menuitem"]`);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = (itemIndex + 1) % menuItems.length;
        (menuItems[nextIndex] as HTMLElement).focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = itemIndex === 0 ? menuItems.length - 1 : itemIndex - 1;
        (menuItems[prevIndex] as HTMLElement).focus();
        break;
      case 'Escape':
        event.preventDefault();
        this.dropdownStates[productId] = false;
        const button = document.querySelector(`button[aria-controls="dropdown-menu-${productId}"]`) as HTMLElement;
        button?.focus();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        (event.target as HTMLElement).click();
        break;
    }
  }
}
