import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductEditComponent } from './product-edit.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../../services/product.service';
import { of } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ModalService } from '../../../../services/modal.service';
import { LoaderComponent } from '../../../../shared/loader/loader.component';

describe('ProductEditComponent', () => {
  let component: ProductEditComponent;
  let fixture: ComponentFixture<ProductEditComponent>;
  let productServiceMock: jasmine.SpyObj<ProductService>;
  let modalServiceMock: jasmine.SpyObj<ModalService>;

  beforeEach(async () => {
    productServiceMock = jasmine.createSpyObj('ProductService', ['getProduct']);
    modalServiceMock = jasmine.createSpyObj('ModalService', ['openModal']);

    productServiceMock.getProduct.and.returnValue(
      of({
        id: '123',
        name: 'Test Product',
        description: 'A valid description.',
        logo: 'http://example.com/logo.png',
        date_release: '2025-03-01',
        date_revision: '2026-01-01',
      } as any)
    );

    await TestBed.configureTestingModule({
      declarations: [ProductEditComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterModule,
        LoaderComponent,
      ],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: ModalService, useValue: modalServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: '123' },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductEditComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have "edit" as the default action', () => {
    expect(component.acction).toBe('edit');
  });

  it('should load product data on init', async () => {
    await component.loadProduct();
    expect(component.form.getRawValue()).toEqual({
      id: '123',
      name: 'Test Product',
      description: 'A valid description.',
      logo: 'http://example.com/logo.png',
      date_release: '2025-03-01',
      date_revision: '2026-01-01',
    });
    expect(productServiceMock.getProduct).toHaveBeenCalledWith('123');
  });

  it('should navigate back if no id is provided', () => {
    const goBackSpy = spyOn(window.history, 'back');
    component['_id'] = null as any;
    component.ngOnInit();
    expect(goBackSpy).toHaveBeenCalled();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
