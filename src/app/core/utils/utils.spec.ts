import { AsyncValidatorFn, FormBuilder, FormControl } from '@angular/forms';
import {
  validateIdInApi,
  validateMinDateFn,
  validateUrl,
} from './formValidators';
import { ProductService } from '../../features/products/services/product.service';
import { Product } from '../../features/products/models/product';
import { of, throwError } from 'rxjs';
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('validateMinDateFn', () => {
  it('should return null if the date is today or in the future', () => {
    const control = new FormControl(new Date().toISOString().split('T')[0]);
    const result = validateMinDateFn()(control);
    expect(result).toBeNull();
  });

  it('should return a validation error if the date is in the past', () => {
    const control = new FormControl('2000-01-01');
    const result = validateMinDateFn()(control);
    expect(result).toEqual({ validateDate: { value: control.value } });
  });
});

describe('validateIdInApi', () => {
  let productService: ProductService;
  let validator: AsyncValidatorFn;
  let formControl: FormControl;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ProductService }],
      declarations: [],
    });
  }));

  beforeEach(() => {
    productService = TestBed.inject(ProductService);
    validator = validateIdInApi(productService);
    formControl = new FormBuilder().control('', [], validator);
  });

  it('should return null if control value is empty', fakeAsync(() => {
    spyOn(productService, 'getProduct').and.returnValue(of(null as any));
    formControl.patchValue('');
    tick(500);

    expect(formControl.hasError('idValidation')).toBeFalse();
  }));

  it('should return a validation error if product exists', fakeAsync(() => {
    const mockProduct: Product = { id: '123', name: 'Product 1' };
    spyOn(productService, 'getProduct').and.returnValue(of(mockProduct));
    formControl.patchValue('123');
    tick(500);
    expect(formControl.hasError('idValidation')).toBeTrue();
  }));

  it('should return null if product does not exist', fakeAsync(() => {
    spyOn(productService, 'getProduct').and.returnValue(of(null as any));
    formControl.patchValue('1234');
    tick(500);
    expect(formControl.hasError('idValidation')).toBeFalse();
  }));
});

describe('validateUrl', () => {
  it('should return null if the URL is valid', () => {
    const control = new FormControl('https://example.com');
    const result = validateUrl()(control);
    expect(result).toBeNull();
  });

  it('should return a validation error if the URL is invalid', () => {
    const control = new FormControl('invalid-url');
    const result = validateUrl()(control);
    expect(result).toEqual({ validateUrl: true });
  });

  it('should return null if the control value is empty', () => {
    const control = new FormControl('');
    const result = validateUrl()(control);
    expect(result).toBeNull();
  });
});
