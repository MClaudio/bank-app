import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @ViewChild('modal') modal!: ElementRef;

  constructor(private _modalService: ModalService) {}

  public get show() {
    return this._modalService.show;
  }

  public set show(show: boolean) {
    this._modalService.show = show;
  }

  public onOk() {
    this._modalService.eventOnOk.emit(true);
    this.show = false;
  }

  public get isDecision() {
    return this._modalService.isDecision;
  }

  public get type() {
    return this._modalService.type;
  }

  public get title() {
    return this._modalService.title;
  }

  public get body() {
    return this._modalService.body;
  }
}
