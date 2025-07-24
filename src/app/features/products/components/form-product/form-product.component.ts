import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-form-product',
  templateUrl: './form-product.component.html',
  styleUrl: './form-product.component.scss',
})
export class FormProductComponent {
  @Input() form!: FormGroup;
  @Input() acction!: string;

  @Output() submit = new EventEmitter<any>();
  @Output() reset = new EventEmitter<void>();

  constructor(
  ) { }

  public isFieldRequired(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return field?.hasError('required') !== undefined && field?.validator !== null;
  }

  public getErrorRequired(field: string) {
    return (
      this.form.get(field)?.hasError('required') &&
      this.form.get(field)?.touched
    );
  }

  public getErrorMinDate(field: string) {
    return (
      this.form.get(field)?.hasError('validateDate') &&
      this.form.get(field)?.touched
    );
  }

  public getErrorIdValidate(field: string) {
    return (
      this.form.get(field)?.hasError('idValidation') &&
      this.form.get(field)?.touched
    );
  }

  public getErrorMax(field: string) {
    return (
      this.form.get(field)?.hasError('maxlength') &&
      this.form.get(field)?.touched
    );
  }

  public getErrorMin(field: string) {
    return (
      this.form.get(field)?.hasError('minlength') &&
      this.form.get(field)?.touched
    );
  }

  public getErrorUrl(field: string) {
    return (
      this.form.get(field)?.hasError('validateUrl') &&
      this.form.get(field)?.touched
    );
  }

  /**
   * @description
   * Changing the date of date_release assigns the date plus one year to the date_revision control.
   *
   * @returns
   */
  public onChangeDate() {
    let dateAddYear = new Date(this.form.get('date_release')?.value);
    dateAddYear.setFullYear(dateAddYear.getFullYear() + 1);
    this.form
      .get('date_revision')
      ?.setValue(dateAddYear.toISOString().split('T')[0]);
  }

  /**
   * @description
   * Saves the form data to the API.
   *
   * @returns
   */
  public async onSaveForm() {
    this.submit.emit(this.form.getRawValue());

  }

  /**
   * @description
   * Resets the form to its original state.
   *
   * @returns
   */
  public onResetForm() {
    this.reset.emit();
  }
}
