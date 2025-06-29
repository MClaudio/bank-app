import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
//import { ProductComponent } from './pages/product/product.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
//import { ProductEditComponent } from './pages/product/product-edit.component';
//import { ProductViewComponent } from './pages/product/product-view.component';
import { ProductCreateComponent } from './pages/product-create/product-create.component';
import { ProductEditComponent } from './pages/product-edit/product-edit.component';
import { ProductViewComponent } from './pages/product-view/product-view.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    children: [
      { path: '', component: ProductListComponent },
      { path: 'new', component: ProductCreateComponent },
      { path: 'edit/:id', component: ProductEditComponent },
      { path: 'view/:id', component: ProductViewComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule { }
