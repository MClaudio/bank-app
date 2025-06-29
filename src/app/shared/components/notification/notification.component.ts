import { Component, ElementRef, ViewChild } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent {
  @ViewChild('container') container!: ElementRef;

  /**
   * @description
   * Constructor
   *
   * @param {NotificationService} _notificationService - NotificationService
   */
  constructor(private _notificationService: NotificationService) {}

  /**
   * @description
   * Get show notification.
   *
   * @returns
   */
  public get show() {
    return this._notificationService.show;
  }

  /**
   * @description
   * Get color notification.
   *
   * @returns
   */
  public get color() {
    return this._notificationService.color;
  }

  /**
   * @description
   * Get message notification.
   *
   * @returns
   */
  public get message() {
    return this._notificationService.message;
  }
}
