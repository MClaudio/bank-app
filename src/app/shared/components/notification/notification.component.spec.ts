import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationComponent } from './notification.component';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationComponent, CommonModule],
      providers: [
        {
          provide: NotificationService,
          useValue: {
            show: true,
            color: '#8BC34A',
            message: 'Test message',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    notificationService = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect show state from NotificationService', () => {
    expect(component.show).toBeTrue();
  });

  it('should reflect color from NotificationService', () => {
    expect(component.color).toBe('#8BC34A');
  });

  it('should reflect message from NotificationService', () => {
    expect(component.message).toBe('Test message');
  });
});
