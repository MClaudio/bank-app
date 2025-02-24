import { GlobalErrorHandler } from './global-error-handler.service';
import { ModalService } from './modal.service';
import { LoaderService } from './loader.service';

describe('GlobalErrorHandler', () => {
  let globalErrorHandler: GlobalErrorHandler;
  let modalService: jasmine.SpyObj<ModalService>;
  let loaderService: jasmine.SpyObj<LoaderService>;

  beforeEach(() => {
    modalService = jasmine.createSpyObj('ModalService', ['openModal']);
    loaderService = jasmine.createSpyObj('LoaderService', ['offLoader']);
    globalErrorHandler = new GlobalErrorHandler(modalService, loaderService);
  });

  it('should be created', () => {
    expect(globalErrorHandler).toBeTruthy();
  });

  it('should call offLoader on handleError', () => {
    const error = new Error('Test error');
    globalErrorHandler.handleError(error);
    expect(loaderService.offLoader).toHaveBeenCalled();
  });

  it('should not show modal for ExpressionChangedAfterItHasBeenCheckedError', () => {
    const error = new Error('ExpressionChangedAfterItHasBeenCheckedError');
    globalErrorHandler.handleError(error);
    expect(modalService.openModal).not.toHaveBeenCalled();
  });

  it('should show modal for HTTP 400 error', () => {
    const error = { status: 400, message: 'Bad Request' };
    globalErrorHandler.handleError(error);
    expect(modalService.openModal).toHaveBeenCalledWith(
      'error',
      'Error',
      'Error en el servidor.'
    );
  });

  it('should show modal for HTTP 404 error', () => {
    const error = { status: 404, message: 'Not Found' };
    globalErrorHandler.handleError(error);
    expect(modalService.openModal).toHaveBeenCalledWith(
      'error',
      'Error',
      'El producto no existe.'
    );
  });

  it('should show modal for HTTP 500 error', () => {
    const error = { status: 500, message: 'Internal Server Error' };
    globalErrorHandler.handleError(error);
    expect(modalService.openModal).toHaveBeenCalledWith(
      'error',
      'Error',
      'Error en el servidor.'
    );
  });

  it('should show default modal for unknown errors', () => {
    const error = { status: 0, message: 'Unknown Error' };
    globalErrorHandler.handleError(error);
    expect(modalService.openModal).toHaveBeenCalledWith(
      'error',
      'Error',
      'Error en la conexión con el servidor.'
    );
  });
});
