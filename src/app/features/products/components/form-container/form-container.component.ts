import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-container',
  templateUrl: './form-container.component.html',
  styleUrl: './form-container.component.scss'
})
export class FormContainerComponent {
  @Input() form!: FormGroup;
  @Input() acction!: string;
  @Input() title: string = 'Formulario de Registro';

  @Output() submit = new EventEmitter<any>();
  @Output() reset = new EventEmitter<void>();

  public onFormSubmit(data: any): void { this.submit.emit(data); }
  public onFormReset(): void { this.reset.emit(); }

}
