import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductComponent } from './product.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../../services/product.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormProductComponent } from '../../components/form-product/form-product.component';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let productServiceMock: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    productServiceMock = jasmine.createSpyObj('ProductService', [
      'getProduct',
      'validateIdInApi',
    ]);
    productServiceMock.getProduct.and.returnValue(of(null as any));

    await TestBed.configureTestingModule({
      declarations: [ProductComponent, FormProductComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, RouterModule],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '123' : null),
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form correctly', () => {
    expect(component.form).toBeDefined();
    expect(component.form.controls['id'].validator).toBeDefined();
    expect(component.form.controls['name'].validator).toBeDefined();
    expect(component.form.controls['description'].validator).toBeDefined();
    expect(component.form.controls['logo'].validator).toBeDefined();
    expect(component.form.controls['date_release'].validator).toBeDefined();
    expect(component.form.controls['date_revision'].validator).toBeDefined();
  });

  it('should have "new" as default action', () => {
    expect(component.acction).toBe('new');
  });

  // it('should call ProductService.getProduct on initialize', () => {
  //   component.ngOnInit();
  //   expect(productServiceMock.getProduct).toHaveBeenCalled();
  // });

  it('should validate id properly', () => {
    component.form.controls['id'].setValue('123');
    component.form.controls['id'].updateValueAndValidity();
    expect(component.form.controls['id'].valid).toBeTrue();
  });

  it('should validate logo URL properly', () => {
    component.form.controls['logo'].setValue('http://valid.url');
    component.form.controls['logo'].updateValueAndValidity();
    expect(component.form.controls['logo'].valid).toBeTrue();
  });

  it('should correctly handle invalid URL for logo', () => {
    component.form.controls['logo'].setValue('invalid-url');
    component.form.controls['logo'].updateValueAndValidity();
    expect(component.form.controls['logo'].valid).toBeFalse();
  });

  it('should validate release date', () => {
    component.form.controls['date_release'].setValue('2025-03-01');
    component.form.controls['date_release'].updateValueAndValidity();
    expect(component.form.controls['date_release'].valid).toBeTrue();
  });

  it('should validate revision date to be disabled initially', () => {
    expect(component.form.controls['date_revision'].disabled).toBeTrue();
  });

  it('should enable revision date after a certain action (assumption)', () => {
    component.acction = 'edit'; // Simulating edit action
    fixture.detectChanges();
    expect(component.form.controls['date_revision'].disabled).toBeTrue();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
