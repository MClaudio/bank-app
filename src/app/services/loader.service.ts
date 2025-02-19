import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private _loader: boolean = true;

  constructor() { }

  public showLoader() {
    this._loader = true;
  }

  public offLoader() {
    this._loader = false;
  }

  public get loader() {
    return this._loader;
  }

}
