import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { NotificationComponent } from './shared/notification/notification.component';
import { ModalComponent } from './shared/modal/modal.component';
import { MenuComponent } from './shared/menu/menu.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { GlobalErrorHandler } from './services/global-error-handler.service';

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
export class AppModule {}
