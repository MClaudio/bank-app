import { ModalService } from '../../shared/services/modal.service';
import { LoaderService } from '../../shared/services/loader.service';
import { GlobalErrorHandler } from './global-error-handler.service';
import { ModalOptions } from '../interfaces/modal-options';

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
    const expectedOptions: ModalOptions = {
      type: 'error',
      title: 'Error',
      body: 'Error en el servidor.',
      isDecision: false
    };
    globalErrorHandler.handleError(error);
    expect(modalService.openModal).toHaveBeenCalledWith(expectedOptions);
  });

  it('should show modal for HTTP 404 error', () => {
    const error = { status: 404, message: 'Not Found' };
    const expectedOptions: ModalOptions = {
      type: 'error',
      title: 'Error',
      body: 'El producto no existe.',
      isDecision: false
    };
    globalErrorHandler.handleError(error);
    expect(modalService.openModal).toHaveBeenCalledWith(expectedOptions);
  });

  it('should show modal for HTTP 500 error', () => {
    const error = { status: 500, message: 'Internal Server Error' };
    const expectedOptions: ModalOptions = {
      type: 'error',
      title: 'Error',
      body: 'Error en el servidor.',
      isDecision: false
    };
    globalErrorHandler.handleError(error);
    expect(modalService.openModal).toHaveBeenCalledWith(expectedOptions);
  });

  it('should show default modal for unknown errors', () => {
    const error = { status: 0, message: 'Unknown Error' };
    const expectedOptions: ModalOptions = {
      type: 'error',
      title: 'Error',
      body: 'Error en la conexión con el servidor.',
      isDecision: false
    };
    globalErrorHandler.handleError(error);
    expect(modalService.openModal).toHaveBeenCalledWith(expectedOptions);
  });
});
