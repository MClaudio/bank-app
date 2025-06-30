import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProductViewComponent } from './product-view.component';
import { ProductService } from '../../services/product.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { FormContainerComponent } from '../../components/form-container/form-container.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const mockProduct = {
  id: 'p-001',
  name: 'Mock Product',
  description: 'Test product',
  logo: 'http://example.com/logo.png',
  date_release: '2026-12-01',
  date_revision: '2026-12-01',
};

const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProduct']);
const loaderServiceSpy = jasmine.createSpyObj('LoaderService', ['showLoader', 'offLoader']);

describe('ProductViewComponent', () => {
  let component: ProductViewComponent;
  let fixture: ComponentFixture<ProductViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductViewComponent, FormContainerComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: productServiceSpy },
        { provide: LoaderService, useValue: loaderServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: 'p-001' },
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    }).compileComponents();

    fixture = TestBed.createComponent(ProductViewComponent);
    component = fixture.componentInstance;

    productServiceSpy.getProduct.and.returnValue(of(mockProduct));

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form in view mode', fakeAsync(() => {
    component.ngOnInit();
    tick();

    fixture.detectChanges();

    expect(component.form).toBeDefined();
    expect(component.form).toBeInstanceOf(FormGroup);
    expect(component.acction).toBe('view');
    expect(component.title).toBe('Vista de producto');

    expect(component.form.get('name')?.value).toBe(mockProduct.name);
    expect(component.form.get('description')?.value).toBe(mockProduct.description);
  }));

  it('should call loadProduct on ngOnInit and patch form', fakeAsync(() => {
    spyOn(component, 'loadProduct').and.callThrough();

    component.ngOnInit();
    tick();

    expect(component.loadProduct).toHaveBeenCalled();
    expect(productServiceSpy.getProduct).toHaveBeenCalledWith('p-001');
    expect(component.form.value.name).toBe(mockProduct.name);
    expect(loaderServiceSpy.showLoader).toHaveBeenCalled();
    expect(loaderServiceSpy.offLoader).toHaveBeenCalled();
  }));

  it('should go back if no ID is provided in route params', () => {
    const backSpy = spyOn(window.history, 'back');

    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      declarations: [ProductViewComponent, FormContainerComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: productServiceSpy },
        { provide: LoaderService, useValue: loaderServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {},
            },
          },
        },
      ],
    }).compileComponents();

    const tempFixture = TestBed.createComponent(ProductViewComponent);
    tempFixture.detectChanges();

    expect(backSpy).toHaveBeenCalled();
  });
});
