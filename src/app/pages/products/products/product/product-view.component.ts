import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  validateIdInApi,
  validateMinDateFn,
} from '../../../../core/utils/formValidators';
import { ProductService } from '../../../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ModalService } from '../../../../services/modal.service';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-product-view',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductViewComponent implements OnInit {
  public form!: FormGroup;
  public acction: string = 'view';
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
      name: [{ value: null, disabled: true }],
      description: [{ value: null, disabled: true }],
      logo: [{ value: null, disabled: true }],
      date_release: [{ value: null, disabled: true }],
      date_revision: [{ value: null, disabled: true }],
    });
  }
}
