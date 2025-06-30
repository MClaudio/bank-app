import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, OnDestroy, DoCheck } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnDestroy, DoCheck {
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('cancelButton') cancelButton!: ElementRef;

  private previouslyFocusedElement: HTMLElement | null = null;
  private focusableElements: HTMLElement[] = [];
  private lastShowState = false;

  constructor(private _modalService: ModalService) { }

  ngDoCheck() {
    // Detectar cambios en el estado del modal
    if (this.show !== this.lastShowState) {
      if (this.show) {
        this.openModal();
      } else {
        this.closeModal();
      }
      this.lastShowState = this.show;
    }
  }

  ngOnDestroy() {
    this.restoreFocus();
    this.enableBodyScroll();
  }

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

  private openModal() {
    // Guardar el elemento que tenía foco antes del modal
    this.previouslyFocusedElement = document.activeElement as HTMLElement;

    // Deshabilitar scroll del body
    this.disableBodyScroll();

    // Obtener elementos enfocables dentro del modal
    setTimeout(() => {
      this.updateFocusableElements();
      this.trapFocus();
    }, 0);
  }

  private closeModal() {
    this.restoreFocus();
    this.enableBodyScroll();
  }

  private disableBodyScroll() {
    document.body.style.overflow = 'hidden';
    document.body.setAttribute('aria-hidden', 'true');
  }

  private enableBodyScroll() {
    document.body.style.overflow = '';
    document.body.removeAttribute('aria-hidden');
  }

  private updateFocusableElements() {
    if (!this.modal?.nativeElement) return;

    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      'a[href]'
    ].join(', ');

    this.focusableElements = Array.from(
      this.modal.nativeElement.querySelectorAll(focusableSelectors)
    );
  }

  private trapFocus() {
    if (this.cancelButton?.nativeElement) {
      this.cancelButton.nativeElement.focus();
    }
  }

  private restoreFocus() {
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.show = false;
      return;
    }

    if (event.key === 'Tab') {
      this.handleTabKey(event);
    }
  }

  private handleTabKey(event: KeyboardEvent) {
    if (this.focusableElements.length === 0) return;

    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }
}
