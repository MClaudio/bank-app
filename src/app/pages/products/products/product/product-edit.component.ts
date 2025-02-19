import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  validateIdInApi,
  validateMinDateFn,
  validateUrl,
} from '../../../../core/utils/formValidators';
import { ProductService } from '../../../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ModalService } from '../../../../services/modal.service';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductEditComponent implements OnInit {
  public form!: FormGroup;
  public acction: string = 'edit';
  private _id: string;

  constructor(
    private _fb: FormBuilder,
    private _productService: ProductService,
    private _route: ActivatedRoute,
    private _modalService: ModalService,
    private _loaderService: LoaderService
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
    try {
      this._loaderService.showLoader();
      let resp = await firstValueFrom(
        this._productService.getProduct(this._id)
      );
      this.createForm();
      this.form.patchValue(resp);
      this._loaderService.offLoader();
    } catch (error: any) {
      this._loaderService.offLoader();
      window.history.back();
      this._modalService.openModal(
        'error',
        'Error',
        error?.error?.message || error?.message || JSON.parse(error)
      );
    }
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
}
