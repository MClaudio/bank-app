import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
//import { ProductComponent } from './pages/product/product.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ComponentsModule } from './components/components.module';
//import { ProductEditComponent } from './pages/product/product-edit.component';
//import { ProductViewComponent } from './pages/product/product-view.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TooltipComponent } from '../../shared/components/tooltip/tooltip.component';
import { ProductCreateComponent } from './pages/product-create/product-create.component';
import { ProductEditComponent } from './pages/product-edit/product-edit.component';
import { ProductViewComponent } from './pages/product-view/product-view.component';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductListComponent,
    ProductEditComponent,
    ProductViewComponent,
    ProductCreateComponent,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ComponentsModule,
    FormsModule,
    RouterModule,
    TooltipComponent,
  ],
})
export class ProductsModule { }
