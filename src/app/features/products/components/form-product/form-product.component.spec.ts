import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { FormProductComponent } from './form-product.component';

const productServiceSpy = jasmine.createSpyObj('ProductService', [
  'createProduct',
  'updateProduct',
]);
const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
  'showSuccess',
  'showError',
]);
const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
const modalServiceSpy = jasmine.createSpyObj('ModalService', ['open', 'close']);

describe('FormProductComponent', () => {
  let component: FormProductComponent;
  let fixture: ComponentFixture<FormProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormProductComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: 'ProductService', useValue: productServiceSpy },
        { provide: 'NotificationService', useValue: notificationServiceSpy },
        { provide: 'Router', useValue: routerSpy },
        { provide: 'ModalService', useValue: modalServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormProductComponent);
    component = fixture.componentInstance;
  });

  function buildDummyForm(): FormGroup {
    return new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      logo: new FormControl(''),
      date_release: new FormControl('', Validators.required),
      date_revision: new FormControl(''),
    });
  }

  it('should be created', () => {
    component.form = buildDummyForm();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('#isFieldRequired', () => {
    beforeEach(() => {
      component.form = buildDummyForm();
    });

    it('returns TRUE for a required control', () => {
      expect(component.isFieldRequired('name')).toBeTrue();
    });

    it('returns FALSE for a non‑required control', () => {
      expect(component.isFieldRequired('description')).toBeFalse();
    });
  });

  describe('error helpers (getErrorRequired)', () => {
    beforeEach(() => {
      component.form = buildDummyForm();
      fixture.detectChanges();
    });

    it('reports required error only when control is touched & empty', () => {
      const nameCtrl = component.form.get('name')!;
      nameCtrl.markAsTouched();
      fixture.detectChanges();

      expect(component.getErrorRequired('name')).toBeTrue();

      nameCtrl.setValue('Product X');
      fixture.detectChanges();

      expect(component.getErrorRequired('name')).toBeFalse();
    });
  });

  describe('#onChangeDate', () => {
    beforeEach(() => {
      component.form = buildDummyForm();
    });

    it('sets date_revision to one year after date_release', () => {
      component.form.get('date_release')!.setValue('2024-07-01');
      component.onChangeDate();

      expect(component.form.get('date_revision')!.value).toBe('2025-07-01');
    });
  });

  describe('output events', () => {
    beforeEach(() => {
      component.form = buildDummyForm();
    });

    it('onSaveForm() emits submit with raw form value', (done) => {
      const expected = component.form.getRawValue();

      component.submit.subscribe((emitted) => {
        expect(emitted).toEqual(expected);
        done();
      });

      component.onSaveForm();
    });

    it('onResetForm() emits reset', (done) => {
      component.reset.subscribe(() => {
        expect(true).toBeTrue();
        done();
      });

      component.onResetForm();
    });
  });
});
