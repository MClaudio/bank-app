import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormContainerComponent } from './form-container.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FormContainerComponent', () => {
  let component: FormContainerComponent;
  let fixture: ComponentFixture<FormContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormContainerComponent],
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([])],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FormContainerComponent);
    component = fixture.componentInstance;
  });

  function buildProductForm(): FormGroup {
    return new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      logo: new FormControl(''),
      date_release: new FormControl(''),
      date_revision: new FormControl('')
    });
  }

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should accept @Input properties correctly', () => {
    const title = 'Test Title';
    const action = 'create';

    component.title = title;
    component.acction = action as any;
    component.form = buildProductForm();

    fixture.detectChanges();

    expect(component.title).toBe(title);
    expect(component.acction).toBe(action);
    expect(component.form).toBeDefined();
    expect(component.form.contains('id')).toBeTrue();
  });

  it('onFormSubmit() should emit the submit event with the provided data', (done) => {
    const payload = { foo: 'bar' };

    component.submit.subscribe((emittedValue) => {
      expect(emittedValue).toEqual(payload);
      done();
    });

    component.onFormSubmit(payload);
  });

  it('onFormReset() should emit the reset event', (done) => {
    component.reset.subscribe(() => {
      expect(true).toBeTrue();
      done();
    });

    component.onFormReset();
  });

  it('should handle empty form initialization', () => {
    component.form = new FormGroup({});
    fixture.detectChanges();

    expect(component.form).toBeDefined();
  });
});
