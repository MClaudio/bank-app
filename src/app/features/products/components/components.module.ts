import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormProductComponent } from './form-product/form-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormContainerComponent } from './form-container/form-container.component';
import { RouterLink } from '@angular/router';

@NgModule({
  declarations: [FormProductComponent, FormContainerComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  exports: [FormProductComponent, FormContainerComponent],
})
export class ComponentsModule {}
