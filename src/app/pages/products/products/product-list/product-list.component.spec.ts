import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductService } from '../../../../services/product.service';
import { NotificationService } from '../../../../services/notification.service';
import { ModalService } from '../../../../services/modal.service';
import { of, throwError } from 'rxjs';
import { Product } from '../../../../core/interfaces/product';
import { LoaderComponent } from '../../../../shared/loader/loader.component';
import { TooltipComponent } from '../../../../shared/tooltip/tooltip.component';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceMock: jasmine.SpyObj<ProductService>;
  let notificationServiceMock: jasmine.SpyObj<NotificationService>;
  let modalServiceMock: jasmine.SpyObj<ModalService>;

  beforeEach(async () => {
    productServiceMock = jasmine.createSpyObj('ProductService', [
      'getProducts',
      'deleteProduct',
    ]);
    notificationServiceMock = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
    ]);
    modalServiceMock = jasmine.createSpyObj('ModalService', [
      'openModal',
      'eventOnOk',
    ]);

    productServiceMock.getProducts.and.returnValue(
      of([{ id: '1', name: 'Product 1', description: 'Description 1' }])
    );
    productServiceMock.deleteProduct.and.returnValue(of({}));

    // modalServiceMock = {
    //   openModal: jasmine.createSpy('openModal'),
    //   eventOnOk: new Subject<boolean>() // Inicializar un Subject
    // };

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
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: ModalService, useValue: modalServiceMock },
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
      ];
      productServiceMock.getProducts.and.returnValue(of(mockProducts));
      await component.ngOnInit();
      expect(component.products).toEqual(mockProducts.slice(0, component.size));
    });
    it('should handle error when loading products', async () => {
      const errorResponse = { message: 'Error loading products' };
      productServiceMock.getProducts.and.returnValue(
        throwError(() => errorResponse)
      );
      modalServiceMock.openModal.and.stub();
      await component.ngOnInit();
      expect(modalServiceMock.openModal).toHaveBeenCalledWith(
        'error',
        'Error',
        errorResponse.message
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const mockProduct: Product = {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
      };
      component.products = [mockProduct];

      // Mock para el servicio de modal
      const modalServiceMock = jasmine.createSpyObj('ModalService', [
        'openModal',
        'eventOnOk',
      ]);

      // Simulando el comportamiento de eventOnOk para llamar al callback con `true`
      modalServiceMock.eventOnOk = {
        subscribe: jasmine.createSpy('subscribe').and.callFake((callback) => {
          callback(true); // Llamamos al callback pasando true
          return { unsubscribe: () => {} }; // Simulando que se devuelve una Subscription
        }),
      };

      // Mock para el servicio de productos
      const productServiceMock = jasmine.createSpyObj('ProductService', [
        'deleteProduct',
      ]);
      productServiceMock.deleteProduct.and.returnValue(of({})); // Simulando la respuesta de eliminación

      // Mock para el servicio de notificaciones
      const notificationServiceMock = jasmine.createSpyObj(
        'NotificationService',
        ['showSuccess']
      );

      // Asignando mocks al componente
      component['_modalService'] = modalServiceMock;
      component['_productService'] = productServiceMock;
      component['_notificationService'] = notificationServiceMock;

      await component.deleteProduct(mockProduct);

      // Verificando que los métodos fueron llamados correctamente
      expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith(
        'Producto eliminado'
      );
      expect(component.products.length).toBe(0);
    });

    // it('should handle error on delete product', async () => {
    //   const mockProduct: Product = {
    //     id: '1',
    //     name: 'Product 1',
    //     description: 'Description 1',
    //   };
    //   component.products = [mockProduct];

    //   // Mock para el servicio de modal
    //   const modalServiceMock = jasmine.createSpyObj('ModalService', [
    //     'openModal',
    //     'eventOnOk',
    //   ]);
    //   modalServiceMock.eventOnOk = {
    //     subscribe: jasmine.createSpy('subscribe').and.callFake((callback) => {
    //       callback(true); // Llamamos al callback pasando true
    //       return { unsubscribe: () => {} }; // Simulando que se devuelve una Subscription
    //     }),
    //   };

    //   // Simulando un error en la eliminación del producto
    //   const errorResponse = { message: 'Error deleting product' };
    //   const productServiceMock = jasmine.createSpyObj('ProductService', [
    //     'deleteProduct',
    //   ]);
    //   productServiceMock.deleteProduct.and.returnValue(
    //     throwError(() => errorResponse)
    //   );

    //   // Mock para el servicio de modal
    //   const notificationServiceMock = jasmine.createSpyObj(
    //     'NotificationService',
    //     ['showSuccess']
    //   );

    //   // Asignando mocks al componente
    //   component['_modalService'] = modalServiceMock;
    //   component['_productService'] = productServiceMock;
    //   component['_notificationService'] = notificationServiceMock;

    //   await component.deleteProduct(mockProduct);

    //   // Verificando que se muestra el error
    //   expect(modalServiceMock.openModal).toHaveBeenCalledWith(
    //     'error',
    //     'Error',
    //     errorResponse.message
    //   );
    // });
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
  });

  describe('onSearch', () => {
    it('should filter products based on search', () => {
      const mockProducts: Product[] = [
        { id: '1', name: 'Product 1', description: 'Description A' },
        { id: '2', name: 'Product 2', description: 'Description B' },
      ];
      component['_products'] = mockProducts;
      component.search = '1';

      component.onSearch();

      expect(component.products).toEqual([mockProducts[0]]);
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
  });

  describe('get length', () => {
    it('should return the length of products', () => {
      component.products = [
        { id: '1', name: 'Product 1', description: 'Description A' },
      ];
      expect(component.length).toBe(1);
    });
  });
});
