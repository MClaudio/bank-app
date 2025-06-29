import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../../../shared/services/loader.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.scss'
})
export class ProductViewComponent implements OnInit {
  public form!: FormGroup;
  public acction: string = 'view';
  private _id: string;
  public title: string = 'Vista de producto';

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _productService: ProductService,
    private readonly _route: ActivatedRoute,
    private readonly _loaderService: LoaderService
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
