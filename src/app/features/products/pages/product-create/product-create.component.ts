import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { validateIdInApi, validateMinDateFn, validateUrl } from '../../../../core/utils/formValidators';
import { Product } from '../../models/product';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss'
})
export class ProductCreateComponent implements OnInit {
  public form!: FormGroup;
  public acction: string = 'new';
  public loader: boolean = false;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _productService: ProductService,
    private readonly _loaderService: LoaderService,
    private readonly _notificationService: NotificationService,
    private readonly _router: Router

  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  /**
   * @description
   * creates the form group.
   *
   * @returns
   */
  private createForm() {
    this.form = this._fb.group({
      id: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
        [validateIdInApi(this._productService)],
      ],
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
    this._loaderService.offLoader();
  }


  public async onSubmit() {
    console.log('Form submitted:', this.form.getRawValue());

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
    await this.createProduct(data);
  }

  private async createProduct(data: Product) {
    let resp = await firstValueFrom(this._productService.createProduct(data));
    this._notificationService.showSuccess('Producto creado exitosamente');
    this._router.navigate(['/product']);
    this._loaderService.offLoader();
  }

  public onReset() {
    this.form.reset();
  }
}
