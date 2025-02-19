import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Product } from '../../../../core/interfaces/product';
import { ProductService } from '../../../../services/product.service';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../../../../services/notification.service';
import { Router } from '@angular/router';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'app-form-product',
  templateUrl: './form-product.component.html',
  styleUrl: './form-product.component.scss',
})
export class FormProductComponent {
  @Input() form!: FormGroup;
  @Input() acction!: string;

  constructor(
    private _productService: ProductService,
    private _notificationService: NotificationService,
    private _router: Router,
    private _modalService: ModalService
  ) {}

  public getErrorRequired(field: string) {
    return (
      this.form.get(field)?.hasError('required') &&
      this.form.get(field)?.touched
    );
  }

  public getErrorMinDate(field: string) {
    return (
      this.form.get(field)?.hasError('validateDate') &&
      this.form.get(field)?.touched
    );
  }

  public getErrorIdValidate(field: string) {
    return (
      this.form.get(field)?.hasError('idValidation') &&
      this.form.get(field)?.touched
    );
  }

  public getErrorMax(field: string) {
    return (
      this.form.get(field)?.hasError('maxlength') &&
      this.form.get(field)?.touched
    );
  }

  public getErrorMin(field: string) {
    return (
      this.form.get(field)?.hasError('minlength') &&
      this.form.get(field)?.touched
    );
  }

  public getErrorUrl(field: string) {
    return (
      this.form.get(field)?.hasError('validateUrl') &&
      this.form.get(field)?.touched
    );
  }

  /**
   * @description
   * Changing the date of date_release assigns the date plus one year to the date_revision control.
   *
   * @returns
   */
  public onChangeDate() {
    let dateAddYear = new Date(this.form.get('date_release')?.value);
    dateAddYear.setFullYear(dateAddYear.getFullYear() + 1);
    this.form
      .get('date_revision')
      ?.setValue(dateAddYear.toISOString().split('T')[0]);
  }

  /**
   * @description
   * Saves the form data to the API.
   *
   * @returns
   */
  public async onSaveForm() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    try {
      let data: Product = {
        ...this.form.getRawValue(),
        date_release: new Date(this.form.get('date_release')?.value)
          .toISOString()
          .split('T')[0],
        date_revision: new Date(this.form.get('date_revision')?.value)
          .toISOString()
          .split('T')[0],
      };
      if (this.acction === 'new') {
        await this.createProduct(data);
        this._notificationService.showSuccess('Producto creado exitosamente');
      } else {
        await this.updateProduct(data);
        this._notificationService.showSuccess(
          'Producto actualizado exitosamente'
        );
      }
      this._router.navigate(['/product']);
    } catch (error: any) {
      this._modalService.openModal(
        'error',
        'Error',
        error?.error?.message || error?.message || JSON.parse(error)
      );
    }
  }

  private async createProduct(data: Product) {
    try {
      let resp = await firstValueFrom(this._productService.createProduct(data));
    } catch (error) {
      throw error;
    }
  }

  private async updateProduct(data: Product) {
    try {
      let resp = await firstValueFrom(this._productService.updateProduct(data));
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Resets the form to its original state.
   *
   * @returns
   */
  public onResetForm() {
    if (this.acction === 'edit') {
      this.form.patchValue({
        name: null,
        description: null,
        logo: null,
        date_release: null,
        date_revision: null,
      });
    } else {
      this.form.reset();
    }
  }
}
