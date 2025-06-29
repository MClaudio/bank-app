import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { MenuComponent } from './layout/menu/menu.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './core/services/global-error-handler.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NotificationComponent,
        MenuComponent,
        ModalComponent,
        RouterModule.forRoot([]),
        LoaderComponent,
      ],
      declarations: [AppComponent],
      providers: [
        provideHttpClientTesting,
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
