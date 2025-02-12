import { TestBed } from '@angular/core/testing';

import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open modal and set properties correctly', () => {
    service.openModal('error', 'Error Title', 'Error body message', true);

    expect(service.show).toBeTrue();
    expect(service.type).toBe('error');
    expect(service.title).toBe('Error Title');
    expect(service.body).toBe('Error body message');
    expect(service.isDecision).toBeTrue();
  });

  it('should set and get show property', () => {
    service.show = true;
    expect(service.show).toBeTrue();

    service.show = false;
    expect(service.show).toBeFalse();
  });

  it('should emit event on ok', (done) => {
    service.eventOnOk.subscribe((decision: boolean) => {
      expect(decision).toBeTrue();
      done();
    });

    service.eventOnOk.emit(true);
  });
});
