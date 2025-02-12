import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { Product } from '../core/interfaces/product';

describe('ProductService', () => {
  let service: ProductService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products', () => {
    const mockProducts: Product[] = [
      {
        id: '123',
        name: 'Product 1',
        description: 'Product 1 description',
        logo: 'https://example.com/logo.png',
        date_release: new Date('2024-08-21'),
        date_revision: new Date('2025-08-21'),
      },
      {
        id: '456',
        name: 'Product 2',
        description: 'Product 2 description',
        logo: 'https://example.com/logo.png',
        date_release: new Date('2024-08-21'),
        date_revision: new Date('2025-08-21'),
      },
      {
        id: '789',
        name: 'Product 3',
        description: 'Product 3 description',
        logo: 'https://example.com/logo.png',
        date_release: new Date('2024-08-21'),
        date_revision: new Date('2025-08-21'),
      },
    ];

    service.getProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpTestingController.expectOne(`${environment.api}/products`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockProducts });
  });

  it('should fetch a single product by ID', () => {
    const mockProduct: Product = {
      id: '123',
      name: 'Product 1',
      description: 'Product 1 description',
      logo: 'https://example.com/logo.png',
      date_release: new Date('2024-08-21'),
      date_revision: new Date('2025-08-21'),
    };

    service.getProduct('123').subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpTestingController.expectOne(
      `${environment.api}/products/123`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should create a product', () => {
    const newProduct: Product = {
      id: '12356',
      name: 'Product 4',
      description: 'Product 4 description',
      logo: 'https://example.com/logo.png',
      date_release: new Date('2024-08-21'),
      date_revision: new Date('2025-08-21'),
    };

    service.createProduct(newProduct).subscribe((product) => {
      expect(product).toEqual(newProduct);
    });

    const req = httpTestingController.expectOne(`${environment.api}/products`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush({ data: newProduct });
  });

  it('should update a product', () => {
    const updatedProduct: Product = {
      id: '123',
      name: 'Product 1 updated',
      description: 'Product 1 description',
      logo: 'https://example.com/logo.png',
      date_release: new Date('2024-08-21'),
      date_revision: new Date('2025-08-21'),
    };

    service.updateProduct(updatedProduct).subscribe((product) => {
      expect(product).toEqual(updatedProduct);
    });

    const req = httpTestingController.expectOne(
      `${environment.api}/products/123`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedProduct);
    req.flush({ data: updatedProduct });
  });

  it('should delete a product', () => {
    service.deleteProduct('12356').subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpTestingController.expectOne(
      `${environment.api}/products/12356`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
