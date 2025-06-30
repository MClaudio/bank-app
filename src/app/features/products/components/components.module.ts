import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormProductComponent } from './form-product/form-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormContainerComponent } from './form-container/form-container.component';
import { RouterLink } from '@angular/router';
import { FloatButtonComponent } from './float-button/float-button.component';

@NgModule({
  declarations: [FormProductComponent, FormContainerComponent, FloatButtonComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  exports: [FormContainerComponent, FloatButtonComponent],
})
export class ComponentsModule { }
