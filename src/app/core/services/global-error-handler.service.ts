import { ErrorHandler, Injectable, ɵformatRuntimeError } from '@angular/core';
import { ModalService } from '../../shared/services/modal.service';
import { LoaderService } from '../../shared/services/loader.service';
import { ModalOptions } from '../interfaces/modal-options';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private _modalService: ModalService,
    private _loaderService: LoaderService
  ) {}

  handleError(error: any): void {
    //console.error('Error global:', error);
    this._loaderService.offLoader();
    if (error.message.includes('ExpressionChangedAfterItHasBeenCheckedError')) {
      return;
    }
    switch (error.status) {
      case 400:
        this.showModal('Error en el servidor.');
        break;
      case 404:
        this.showModal('El producto no existe.');
        break;
      case 500:
        this.showModal('Error en el servidor.');
        break;
      default:
        this.showModal('Error en la conexión con el servidor.');
        break;
    }
  }

  private showModal(message: string) {
    let options: ModalOptions = {
      type: 'error',
      title: 'Error',
      body: message,
      isDecision: false,
    };
    this._modalService.openModal(options);
  }
}
