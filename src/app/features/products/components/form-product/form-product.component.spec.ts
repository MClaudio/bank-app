import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormProductComponent } from './form-product.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductService } from '../../services/product.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Router } from '@angular/router';
import { ModalService } from '../../../../shared/services/modal.service';
import {
  validateIdInApi,
  validateMinDateFn,
  validateUrl,
} from '../../../../core/utils/formValidators';
import { of, throwError } from 'rxjs';

describe('FormProductComponent', () => {
  let component: FormProductComponent;
  let fixture: ComponentFixture<FormProductComponent>;
  let productServiceMock: jasmine.SpyObj<ProductService>;
  let notificationServiceMock: jasmine.SpyObj<NotificationService>;
  let routerMock: jasmine.SpyObj<Router>;
  let modalServiceMock: jasmine.SpyObj<ModalService>;

  beforeEach(async () => {
    productServiceMock = jasmine.createSpyObj('ProductService', [
      'createProduct',
      'updateProduct',
      'getProduct',
    ]);
    productServiceMock.getProduct.and.returnValue(of(null as any));
    notificationServiceMock = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
    ]);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    modalServiceMock = jasmine.createSpyObj('ModalService', ['openModal']);
    modalServiceMock.openModal = jasmine.createSpy('openModal');

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [FormProductComponent],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        //{ provide: ProductService, useValue: productServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ModalService, useValue: modalServiceMock },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormProductComponent);
    component = fixture.componentInstance;

    component.form = TestBed.inject(FormBuilder).group({
      id: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
        [validateIdInApi(productServiceMock)],
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

    component.acction = 'new';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Error Handling Methods', () => {
    describe('getErrorRequired', () => {
      it('should return true if field is required and touched', () => {
        component.form.get('id')?.setValue(null);
        component.form.get('id')?.markAsTouched();
        expect(component.getErrorRequired('id')).toBeTrue();
      });

      it('should return false if field is not required or not touched', () => {
        component.form.get('id')?.setValue('123456');
        component.form.get('id')?.markAsTouched();
        expect(component.getErrorRequired('id')).toBeFalse();
      });
    });

    describe('getErrorMinDate', () => {
      it('should return true if field has "validateDate" error and is touched', () => {
        component.form.get('date_release')?.setErrors({ validateDate: true });
        component.form.get('date_release')?.markAsTouched();
        expect(component.getErrorMinDate('date_release')).toBeTrue();
      });

      it('should return false if field does not have "validateDate" error or is not touched', () => {
        component.form.get('date_release')?.setErrors(null);
        expect(component.getErrorMinDate('date_release')).toBeFalse();
      });
    });

    describe('getErrorIdValidate', () => {
      it('should return true if field has "idValidation" error and is touched', () => {
        component.form.get('id')?.setErrors({ idValidation: true });
        component.form.get('id')?.markAsTouched();
        expect(component.getErrorIdValidate('id')).toBeTrue();
      });

      it('should return false if field does not have "idValidation" error or is not touched', () => {
        component.form.get('id')?.setErrors(null);
        expect(component.getErrorIdValidate('id')).toBeFalse();
      });
    });

    describe('getErrorMax', () => {
      it('should return true if field has "maxlength" error and is touched', () => {
        component.form.get('id')?.setValue('too_long_id_validation_12345');
        component.form.get('id')?.markAsTouched();
        expect(component.getErrorMax('id')).toBeTrue();
      });

      it('should return false if field does not have "maxlength" error or is not touched', () => {
        component.form.get('id')?.setValue('id_123');
        expect(component.getErrorMax('id')).toBeFalse();
      });
    });

    describe('getErrorMin', () => {
      it('should return true if field has "minlength" error and is touched', () => {
        component.form.get('id')?.setValue('1');
        component.form.get('id')?.markAsTouched();
        expect(component.getErrorMin('id')).toBeTrue();
      });

      it('should return false if field does not have "minlength" error or is not touched', () => {
        component.form.get('id')?.setValue('123456');
        expect(component.getErrorMin('id')).toBeFalse();
      });
    });

    describe('getErrorUrl', () => {
      it('should return true if field has "validateUrl" error and is touched', () => {
        component.form.get('logo')?.setErrors({ validateUrl: true });
        component.form.get('logo')?.markAsTouched();
        expect(component.getErrorUrl('logo')).toBeTrue();
      });

      it('should return false if field does not have "validateUrl" error or is not touched', () => {
        component.form.get('logo')?.setErrors(null);
        expect(component.getErrorUrl('logo')).toBeFalse();
      });
    });
  });

  describe('onChangeDate', () => {
    it('should set date_revision to one year after date_release', () => {
      const releaseDate = new Date();
      component.form
        .get('date_release')
        ?.setValue(releaseDate.toISOString().split('T')[0]);
      component.onChangeDate();
      const expectedDate = new Date(releaseDate);
      expectedDate.setFullYear(expectedDate.getFullYear() + 1);
      expect(component.form.get('date_revision')?.value).toBe(
        expectedDate.toISOString().split('T')[0]
      );
    });
  });

  describe('onSaveForm', () => {
    it('should call createProduct and navigate on success', async () => {
      component.form.get('id')?.setValue('i23458');
      component.form.get('name')?.setValue('Product Name');
      component.form.get('description')?.setValue('This is a description');
      component.form.get('logo')?.setValue('https://example.com/logo.png');
      component.form.get('date_release')?.setValue('2025-03-01');
      component.form.get('date_revision')?.setValue('2026-01-01');
      component.form.markAllAsTouched();

      expect(component.form.valid).toBeTrue();

      productServiceMock.createProduct.and.returnValue(of({}));
      await component.onSaveForm();
      expect(productServiceMock.createProduct).toHaveBeenCalled();
      expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith(
        'Producto creado exitosamente'
      );
      expect(routerMock.navigate).toHaveBeenCalledWith(['/product']);
    });
    it('should call updateProduct and navigate on success', async () => {
      component.acction = 'edit';
      productServiceMock.updateProduct.and.returnValue(of({}));
      component.form.get('id')?.setValue('i23458');
      component.form.get('name')?.setValue('Updated Product');
      component.form.get('description')?.setValue('Updated description');
      component.form.get('logo')?.setValue('https://example.com/logo.png');
      component.form.get('date_release')?.setValue('2025-03-01');
      component.form.get('date_revision')?.setValue('2026-01-01');
      expect(component.form.valid).toBeTrue();
      await component.onSaveForm();
      expect(productServiceMock.updateProduct).toHaveBeenCalled();
      expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith(
        'Producto actualizado exitosamente'
      );
      expect(routerMock.navigate).toHaveBeenCalledWith(['/product']);
    });
    // it('should handle error during product creation', async () => {
    //   const error = { error: { message: 'Creation error' } };
    //   productServiceMock.createProduct.and.returnValue(throwError(() => error));

    //   await component.onSaveForm();

    //   expect(modalServiceMock.openModal).toHaveBeenCalledWith(
    //     'error', // Tipo del modal
    //     'Error', // Título del modal
    //     'Creation error' // Mensaje del modal
    //   );
    // });
    // it('should handle error during product update', async () => {
    //   component.acction = 'edit';
    //   const error = { error: { message: 'Update error' } };
    //   productServiceMock.updateProduct.and.returnValue(throwError(error));
    //   await component.onSaveForm();
    //   expect(modalServiceMock.openModal).toHaveBeenCalledWith(
    //     'error',
    //     'Error',
    //     'Update error'
    //   );
    // });
    //   it('should not proceed if form is invalid', async () => {
    //     component.form.setErrors({ invalid: true });
    //     await component.onSaveForm();
    //     expect(productServiceMock.createProduct).not.toHaveBeenCalled();
    //     expect(productServiceMock.updateProduct).not.toHaveBeenCalled();
    //   });
  });

  describe('onResetForm', () => {
    it('should reset the form to its original state if action is "new"', () => {
      component.acction = 'new';
      component.onResetForm();
      expect(component.form.getRawValue()).toEqual({
        id: null,
        name: null,
        description: null,
        logo: null,
        date_release: null,
        date_revision: null,
      });
    });

    it('should reset certain fields if action is "edit"', () => {
      component.acction = 'edit';
      component.form.get('id')?.setValue('123456');
      component.onResetForm();
      expect(component.form.getRawValue()).toEqual({
        id: '123456',
        name: null,
        description: null,
        logo: null,
        date_release: null,
        date_revision: null,
      });
    });
  });
});
