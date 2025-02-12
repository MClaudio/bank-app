import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _show: boolean = false;
  private _color: string = '#8BC34A';
  private _message: string = '';

  constructor() {}

  public get show() {
    return this._show;
  }

  public get color() {
    return this._color;
  }

  public get message() {
    return this._message;
  }

  /**
   * @description
   * Show success notification.
   *
   * @param {string} message - Message notification
   * @returns
   */
  public showSuccess(message: string) {
    if (this._show) {
      return;
    }
    this._show = true;
    this._color = '#8BC34A';
    this._message = message;
    setTimeout(() => {
      this._show = false;
    }, 3000);
  }

  /**
   * @description
   * Show error notification.
   *
   * @param {string} message - Message notification
   * @returns
   */
  public showError(message: string) {
    if (this._show) {
      return;
    }
    this._show = true;
    this._color = '#F44336';
    this._message = message;
    setTimeout(() => {
      this._show = false;
    }, 3000);
  }
}
