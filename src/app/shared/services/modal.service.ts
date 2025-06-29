import { EventEmitter, Injectable } from '@angular/core';
import { ModalOptions } from '../../core/interfaces/modal-options';
import { NotificationType } from '../../core/types/types';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private _show = false;
  private _title: string = '';
  private _body: string = '';
  private _type: NotificationType = 'success';
  private _isDecision: boolean = false;
  private _eventOk: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  /**
   * @description
   * Open modal.
   *
   * @param {string} type - Type modal (success, error)
   * @param {string} title - Title modal
   * @param {string} body - Body modal
   * @param {boolean} isDecision - Is decision modal (true/false)
   * @returns
   */
  public openModal(
    // type: string,
    // title: string,
    // body: string,
    // isDecision: boolean = false
    options: ModalOptions
  ) {
    this._show = true;
    this._type = options.type;
    this._title = options.title;
    this._body = options.body;
    this._isDecision = options.isDecision;
  }

  public get show(): boolean {
    return this._show;
  }

  public set show(show: boolean) {
    this._show = show;
  }

  public get type(): NotificationType {
    return this._type;
  }

  public get title(): string {
    return this._title;
  }

  public get body(): string {
    return this._body;
  }

  public get isDecision(): boolean {
    return this._isDecision;
  }

  public get eventOnOk(): EventEmitter<boolean> {
    return this._eventOk;
  }
}
