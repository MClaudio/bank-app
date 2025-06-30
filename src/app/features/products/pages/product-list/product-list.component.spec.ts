import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductService } from '../../services/product.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { of } from 'rxjs';
import { Product } from '../../models/product';
import { TooltipComponent } from '../../../../shared/components/tooltip/tooltip.component';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceMock: jasmine.SpyObj<ProductService>;
  let loaderServiceMock: jasmine.SpyObj<LoaderService>;

  beforeEach(async () => {
    productServiceMock = jasmine.createSpyObj('ProductService', [
      'getProducts'
    ]);
    loaderServiceMock = jasmine.createSpyObj('LoaderService', [
      'showLoader',
      'offLoader'
    ]);

    productServiceMock.getProducts.and.returnValue(
      of([{ id: '1', name: 'Product 1', description: 'Description 1' }])
    );

    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule,
        TooltipComponent,
      ],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: LoaderService, useValue: loaderServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load products on initialization', async () => {
      const mockProducts: Product[] = [
        { id: '1', name: 'Product 1', description: 'Description 1' },
        { id: '2', name: 'Product 2', description: 'Description 2' },
      ];
      productServiceMock.getProducts.and.returnValue(of(mockProducts));

      await component.ngOnInit();

      expect(loaderServiceMock.showLoader).toHaveBeenCalled();
      expect(loaderServiceMock.offLoader).toHaveBeenCalled();
      expect(component.products).toEqual(mockProducts.slice(0, component.size));
    });
  });

  describe('onChangeSize', () => {
    it('should update the product list based on size', () => {
      const mockProducts: Product[] = [
        { id: '1', name: 'Product 1', description: 'Description 1' },
        { id: '2', name: 'Product 2', description: 'Description 2' },
      ];
      component['_products'] = mockProducts;
      component.size = 1;

      component.onChangeSize();

      expect(component.products).toEqual(mockProducts.slice(0, 1));
    });

    it('should use provided products array when passed', () => {
      const mockProducts: Product[] = [
        { id: '1', name: 'Product 1', description: 'Description 1' },
        { id: '2', name: 'Product 2', description: 'Description 2' },
      ];
      component.size = 1;

      component.onChangeSize(mockProducts);

      expect(component.products).toEqual(mockProducts.slice(0, 1));
    });
  });

  describe('onSearch', () => {
    beforeEach(() => {
      const mockProducts: Product[] = [
        { id: '1', name: 'Product 1', description: 'Description A' },
        { id: '2', name: 'Product 2', description: 'Description B' },
      ];
      component['_products'] = mockProducts;
    });

    it('should filter products based on search by name', () => {
      component.search = '1';
      component.onSearch();
      expect(component.products.length).toBe(1);
      expect(component.products[0].name).toBe('Product 1');
    });

    it('should filter products based on search by description', () => {
      component.search = 'Description A';
      component.onSearch();
      expect(component.products.length).toBe(1);
      expect(component.products[0].description).toBe('Description A');
    });

    it('should filter products based on search by id', () => {
      component.search = '2';
      component.onSearch();
      expect(component.products.length).toBe(1);
      expect(component.products[0].id).toBe('2');
    });

    it('should reset search if no input', () => {
      const mockProducts: Product[] = [
        { id: '1', name: 'Product 1', description: 'Description A' },
        { id: '2', name: 'Product 2', description: 'Description B' },
      ];
      component['_products'] = mockProducts;
      component.search = '';

      component.onSearch();

      expect(component.products).toEqual(mockProducts);
    });

    it('should handle search with trimmed whitespace', () => {
      component.search = '  1  ';
      component.onSearch();
      expect(component.products.length).toBe(1);
      expect(component.products[0].name).toBe('Product 1');
    });

    it('should be case insensitive', () => {
      component.search = 'PRODUCT 1';
      component.onSearch();
      expect(component.products.length).toBe(1);
      expect(component.products[0].name).toBe('Product 1');
    });
  });

  describe('get length', () => {
    it('should return the length of products', () => {
      component.products = [
        { id: '1', name: 'Product 1', description: 'Description A' },
        { id: '2', name: 'Product 2', description: 'Description B' },
      ];
      expect(component.length).toBe(2);
    });

    it('should return 0 for empty products array', () => {
      component.products = [];
      expect(component.length).toBe(0);
    });
  });
});
