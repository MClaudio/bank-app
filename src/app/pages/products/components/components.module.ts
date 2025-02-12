import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormProductComponent } from './form-product/form-product.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FormProductComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [FormProductComponent],
})
export class ComponentsModule {}
