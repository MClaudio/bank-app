import { ErrorHandler, Injectable, ɵformatRuntimeError } from '@angular/core';
import { ModalService } from './modal.service';
import { LoaderService } from './loader.service';

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
    this._modalService.openModal('error', 'Error', message);
  }
}
