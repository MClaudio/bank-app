import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'product',
    pathMatch: 'full',
  },
  {
    path: 'product',
    loadChildren: () =>
      import('./features/products/products.module').then((m) => m.ProductsModule),
  },
  {
    path: '**',
    redirectTo: 'product',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
