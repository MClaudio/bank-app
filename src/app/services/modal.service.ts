import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private _show: boolean = false;
  private _title: string = '';
  private _body: string = '';
  private _type: string = 'success';
  private _isDecision: boolean = false;
  private _eventOk: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

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
    type: string,
    title: string,
    body: string,
    isDecision: boolean = false
  ) {
    this._show = true;
    this._type = type;
    this._title = title;
    this._body = body;
    this._isDecision = isDecision;
  }

  public get show(): boolean {
    return this._show;
  }

  public set show(show: boolean) {
    this._show = show;
  }

  public get type(): string {
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
