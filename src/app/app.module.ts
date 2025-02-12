import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { NotificationComponent } from './shared/notification/notification.component';
import { ModalComponent } from './shared/modal/modal.component';
import { MenuComponent } from './shared/menu/menu.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NotificationComponent,
    ModalComponent,
    MenuComponent
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
