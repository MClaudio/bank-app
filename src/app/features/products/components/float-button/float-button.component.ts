import { Component, Input, OnDestroy } from '@angular/core';
import { Product } from '../../models/product';
import { ModalOptions } from '../../../../core/interfaces/modal-options';
import { NotificationService } from '../../../../shared/services/notification.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { firstValueFrom, Subject, take, takeUntil } from 'rxjs';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-float-button',
  templateUrl: './float-button.component.html',
  styleUrl: './float-button.component.scss'
})
export class FloatButtonComponent implements OnDestroy {
  @Input() public product!: Product;
  @Input() public products: Product[] = [];

  public dropdownStates: { [key: string]: boolean } = {};
  private destroy$ = new Subject<void>();

  constructor(
    private readonly _notificationService: NotificationService,
    private readonly _modalService: ModalService,
    private readonly _productService: ProductService,
  ) { }

  ngOnDestroy(): void {
    //this._subscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
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

  public toggleDropdown(productId: string): void {
    // Cerrar otros dropdowns
    Object.keys(this.dropdownStates).forEach(key => {
      if (key !== productId) {
        this.dropdownStates[key] = false;
      }
    });

    this.dropdownStates[productId] = !this.dropdownStates[productId];
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

}
