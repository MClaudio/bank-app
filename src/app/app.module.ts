import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { MenuComponent } from './layout/menu/menu.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { GlobalErrorHandler } from './core/services/global-error-handler.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NotificationComponent,
    ModalComponent,
    MenuComponent,
    LoaderComponent,
  ],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideHttpClient(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
