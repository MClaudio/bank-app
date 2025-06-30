import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validateMinDateFn, validateUrl } from '../../../../core/utils/formValidators';
import { firstValueFrom } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../../shared/services/loader.service';
import { Product } from '../../models/product';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent implements OnInit {
  public form!: FormGroup;
  public acction: string = 'edit';
  private _id: string;
  public title: string = 'Editar producto';

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _productService: ProductService,
    private readonly _route: ActivatedRoute,
    private readonly _loaderService: LoaderService,
    private readonly _notificationService: NotificationService,
    private readonly _router: Router
  ) {
    let params: any = this._route.snapshot.params;
    this._id = params.id;

  }

  ngOnInit(): void {
    if (!this._id) {
      window.history.back();
    }
    this.loadProduct();
  }

  /**
   * @description
   * Loads the product data from the API.
   *
   * @returns
   */
  public async loadProduct() {
    this._loaderService.showLoader();
    let resp = await firstValueFrom(this._productService.getProduct(this._id));
    this.createForm();
    this.form.patchValue(resp);
    this._loaderService.offLoader();
  }

  /**
   * @description
   * creates the form group.
   *
   * @returns
   */
  private createForm() {
    this.form = this._fb.group({
      id: [{ value: null, disabled: true }],
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: [null, [Validators.required, validateUrl()]],
      date_release: [null, [Validators.required, validateMinDateFn()]],
      date_revision: [{ value: null, disabled: true }, [Validators.required]],
    });
  }

  public async onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    let data: Product = {
      ...this.form.getRawValue(),
      date_release: new Date(this.form.get('date_release')?.value)
        .toISOString()
        .split('T')[0],
      date_revision: new Date(this.form.get('date_revision')?.value)
        .toISOString()
        .split('T')[0],
    };
    this._loaderService.showLoader();
    await this.updateProduct(data);
  }

  private async updateProduct(data: Product) {
    let resp = await firstValueFrom(this._productService.updateProduct(data));
    this._notificationService.showSuccess('Producto editado exitosamente');
    this._router.navigate(['/product']);
    this._loaderService.offLoader();
  }

  public onReset() {
    this.form.patchValue({
      name: null,
      description: null,
      logo: null,
      date_release: null,
      date_revision: null,
    });
  }
}
