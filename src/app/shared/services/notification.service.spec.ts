import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show success notification correctly', fakeAsync(() => {
    service.showSuccess('Success message');
    expect(service.show).toBeTrue();
    expect(service.color).toBe('#8BC34A');
    expect(service.message).toBe('Success message');
    tick(3000);
    expect(service.show).toBeFalse();
  }));

  it('should show error notification correctly', fakeAsync(() => {
    service.showError('Error message');
    expect(service.show).toBeTrue();
    expect(service.color).toBe('#F44336');
    expect(service.message).toBe('Error message');
    tick(3000);
    expect(service.show).toBeFalse();
  }));

  it('should not show notification if one is already being shown', fakeAsync(() => {
    service.showSuccess('First message');
    service.showSuccess('Second message');
    expect(service.show).toBeTrue();
    expect(service.color).toBe('#8BC34A');
    expect(service.message).toBe('First message');
    tick(3000);
    expect(service.show).toBeFalse();
  }));
});
