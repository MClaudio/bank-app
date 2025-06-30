import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ProductEditComponent } from './product-edit.component';
import { ProductService } from '../../services/product.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { FormContainerComponent } from '../../components/form-container/form-container.component';

const mockProduct = {
  id: 'p-001',
  name: 'Mock Product',
  description: 'Lorem ipsum dolor sit amet',
  logo: 'https://example.com/logo.png',
  date_release: '2026-12-01',
  date_revision: '2026-12-01',
};

const productServiceSpy = jasmine.createSpyObj('ProductService', [
  'getProduct',
  'updateProduct',
]);
productServiceSpy.getProduct.and.returnValue(of(mockProduct));
productServiceSpy.updateProduct.and.returnValue(of(null));

const loaderServiceSpy = jasmine.createSpyObj('LoaderService', [
  'showLoader',
  'offLoader',
]);

const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
  'showSuccess',
]);

const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

describe('ProductEditComponent', () => {
  let component: ProductEditComponent;
  let fixture: ComponentFixture<ProductEditComponent>;

  function flushMicrotasks() {
    tick();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductEditComponent, FormContainerComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: productServiceSpy },
        { provide: LoaderService, useValue: loaderServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: 'p-001' } } },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductEditComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load product data on ngOnInit and patch the form', fakeAsync(() => {
    component.ngOnInit();
    flushMicrotasks();

    expect(loaderServiceSpy.showLoader).toHaveBeenCalled();
    expect(productServiceSpy.getProduct).toHaveBeenCalledWith('p-001');
    expect(component.form.value.name).toBe(mockProduct.name);
    expect(loaderServiceSpy.offLoader).toHaveBeenCalled();
  }));

  it('should call updateProduct, show success and navigate on valid submit', fakeAsync(() => {
    component.ngOnInit();
    flushMicrotasks();

    component.onSubmit();
    flushMicrotasks();

    expect(loaderServiceSpy.showLoader).toHaveBeenCalled();
    expect(productServiceSpy.updateProduct).toHaveBeenCalled();

    const sentData = productServiceSpy.updateProduct.calls.mostRecent()
      .args[0] as any;
    expect(sentData.id).toBe('p-001');
    expect(sentData.date_release).toBe('2026-12-01');
    expect(sentData.date_revision).toBe('2026-12-01');

    expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith(
      'Producto editado exitosamente',
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/product']);
    expect(loaderServiceSpy.offLoader).toHaveBeenCalled();
  }));

  it('should clear editable fields on onReset()', fakeAsync(() => {
    component.ngOnInit();
    flushMicrotasks();

    component.onReset();

    expect(component.form.get('name')?.value).toBeNull();
    expect(component.form.get('description')?.value).toBeNull();
    expect(component.form.get('logo')?.value).toBeNull();
    expect(component.form.get('date_release')?.value).toBeNull();
    expect(component.form.get('date_revision')?.value).toBeNull();
  }));

});
