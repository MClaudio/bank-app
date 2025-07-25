import { Injectable } from '@angular/core';
import { NotificationOptions } from '../../core/interfaces/notification-options';
import { NotificationType } from '../../core/types/types';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _show: boolean = false;
  private _color: string = '#8BC34A';
  private _message: string = '';
  private readonly colors: Record<NotificationType, string> = {
    success: '#8BC34A',
    error: '#F44336',
  }

  private readonly getColor = (type: NotificationType): string => this.colors[type];
  private readonly showNotification = (options: NotificationOptions) => {
    if (this._show) {
      return;
    }
    this._show = true;
    this._color = this.getColor(options.type);
    this._message = options.message;
    setTimeout(() => {
      this._show = false;
    }, 3000);
  }
  constructor() { }

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
    this.showNotification({ message, type: 'success' });
  }

  /**
   * @description
   * Show error notification.
   *
   * @param {string} message - Message notification
   * @returns
   */
  public showError(message: string) {
    this.showNotification({ message, type: 'error' });
  }
}
