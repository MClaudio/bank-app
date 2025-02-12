import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { catchError, map, Observable, of } from 'rxjs';
import { Product } from '../interfaces/product';

/**
 * @description
 * Validator function to validate the minimum date.
 * 
 * @returns {ValidatorFn} A validator function that returns the validation errors or null if there are no errors.
 */
export function validateMinDateFn(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const todayString = new Date().toISOString().split('T')[0];
    const controlDate = new Date(control?.value).toISOString().split('T')[0];

    if (control.value && controlDate < todayString) {
      return { validateDate: { value: control.value } };
    }
    return null;
  };
}

/**
 * @description
 * Asynchronously validates whether the ID exists in the API.
 * 
 * @param {ProductService} service - ProductService
 * @returns {AsyncValidatorFn} An asynchronous validator function that returns an observable with the validation errors or null if there are no errors.
 */
export function validateIdInApi(service: ProductService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    return service.getProduct(control.value).pipe(
      map((product: Product) => (product ? { idValidation: true } : null)),
      catchError(() => of(null))
    );
  };
}

/**
 * @description
 * Validator function to validate the URL.
 * 
 * @returns {ValidatorFn} A validator function that returns the validation errors or null if there are no errors.
 */
export function validateUrl(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (!control.value) {
      return null;
    }
    const isValid = urlPattern.test(control.value);
    return isValid ? null : { validateUrl: true };
  };
}
