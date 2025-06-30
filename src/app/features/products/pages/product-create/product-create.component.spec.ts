import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ProductCreateComponent } from './product-create.component';
import { ProductService } from '../../services/product.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { NotificationService } from '../../../../shared/services/notification.service';

const productServiceSpy = jasmine.createSpyObj('ProductService', [
  'createProduct',
  'getProduct',
], {
  getProduct: jasmine.createSpy('getProduct').and.returnValue(of(null))
});

const loaderServiceSpy = jasmine.createSpyObj('LoaderService', [
  'showLoader',
  'offLoader',
]);

const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
  'showSuccess',
]);

const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

describe('ProductCreateComponent', () => {
  let component: ProductCreateComponent;
  let fixture: ComponentFixture<ProductCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductCreateComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: productServiceSpy },
        { provide: LoaderService, useValue: loaderServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCreateComponent);
    component = fixture.componentInstance;

    productServiceSpy.getProduct.and.returnValue(of(null));

    fixture.detectChanges();
  });

  it('should create the component and build the form on ngOnInit', fakeAsync(() => {
    expect(component).toBeTruthy();
    expect(component.form).toBeDefined();
    expect(component.acction).toBe('new');

    tick();
  }));

  it('should create a product, show success, navigate and toggle loader on valid submit', fakeAsync(() => {
    productServiceSpy.createProduct.and.returnValue(of({}));

    component.form.patchValue({
      id: 'ABC123',
      name: 'New Product',
      description: 'Fantastic description',
      logo: 'https://example.com/logo.png',
      date_release: '2026-12-01',
    });

    component.form.get('date_revision')?.enable();
    component.form.get('date_revision')?.setValue('2026-12-01');

    tick();

    expect(component.form.valid).toBeTrue();

    component.onSubmit();
    tick();

    expect(loaderServiceSpy.showLoader).toHaveBeenCalled();
    expect(productServiceSpy.createProduct).toHaveBeenCalledTimes(1);
    expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith(
      'Producto creado exitosamente'
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/product']);
    expect(loaderServiceSpy.offLoader).toHaveBeenCalled();
  }));

  it('should reset the form on onReset()', fakeAsync(() => {
    component.form.patchValue({
      id: 'XYZ',
      name: 'Temp',
    });

    tick();

    component.onReset();

    expect(component.form.get('id')?.value).toBeNull();
    expect(component.form.pristine).toBeTrue();
  }));
});
