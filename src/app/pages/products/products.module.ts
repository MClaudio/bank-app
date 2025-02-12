import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ProductComponent } from './products/product/product.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ComponentsModule } from './components/components.module';
import { ProductEditComponent } from './products/product/product-edit.component';
import { ProductViewComponent } from './products/product/product-view.component';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductComponent,
    ProductListComponent,
    ProductEditComponent,
    ProductViewComponent,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ComponentsModule,
    FormsModule,
    LoaderComponent,
    RouterModule
  ],
})
export class ProductsModule {}
