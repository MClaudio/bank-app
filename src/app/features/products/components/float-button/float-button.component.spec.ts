import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';

import { FloatButtonComponent } from './float-button.component';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { ModalService } from '../../../../shared/services/modal.service';

class ModalServiceStub {
  public eventOnOk = new Subject<boolean>();
  public openModal = jasmine.createSpy('openModal');
}

const productServiceSpy = jasmine.createSpyObj<ProductService>('ProductService', [
  'deleteProduct',
]);
productServiceSpy.deleteProduct.and.returnValue(of(null));

const notificationServiceSpy = jasmine.createSpyObj<NotificationService>(
  'NotificationService',
  ['showSuccess', 'showError'],
);

describe('FloatButtonComponent', () => {
  let component: FloatButtonComponent;
  let fixture: ComponentFixture<FloatButtonComponent>;
  let modalService: ModalServiceStub;

  const productA: Product = {
    id: 'p-001',
    name: 'Alpha',
  } as Product;

  const productB: Product = {
    id: 'p-002',
    name: 'Beta',
  } as Product;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FloatButtonComponent],
      providers: [
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ProductService, useValue: productServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FloatButtonComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(ModalService) as unknown as ModalServiceStub;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#toggleDropdown', () => {
    it('opens the requested dropdown and closes others', () => {
      component.dropdownStates = { 'p-001': true, 'p-002': false };

      component.toggleDropdown('p-002');

      expect(component.dropdownStates['p-002']).toBeTrue();
      expect(component.dropdownStates['p-001']).toBeFalse();
    });

    it('toggles the same dropdown on consecutive calls', () => {
      component.toggleDropdown('p-001');
      expect(component.dropdownStates['p-001']).toBeTrue();

      component.toggleDropdown('p-001');
      expect(component.dropdownStates['p-001']).toBeFalse();
    });
  });

  it('closes dropdown on Escape key press', () => {
    component.dropdownStates['p-001'] = true;
    const event = new KeyboardEvent('keydown', { key: 'Escape' });

    component.onDropdownKeydown(event, 'p-001');

    expect(component.dropdownStates['p-001']).toBeFalse();
  });

  describe('#deleteProduct', () => {
    beforeEach(() => {
      component.products = [productA, productB];
    });

    it('opens a confirmation modal', fakeAsync(() => {
      component.deleteProduct(productA);
      expect(modalService.openModal).toHaveBeenCalled();
    }));

    it('deletes product after user confirms', fakeAsync(() => {
      component.deleteProduct(productA);

      modalService.eventOnOk.next(true);
      tick();

      expect(productServiceSpy.deleteProduct).toHaveBeenCalledWith('p-001');
      expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith(
        'Producto eliminado',
      );
      expect(component.products.length).toBe(1);
      expect(component.products[0].id).toBe('p-002');
    }));

  });
});
