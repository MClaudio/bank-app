import { TestBed } from '@angular/core/testing';
import { ModalService } from './modal.service';
import { ModalOptions } from '../../core/interfaces/modal-options';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have default values', () => {
    expect(service.show).toBeFalse();
    expect(service.type).toBe('success');
    expect(service.title).toBe('');
    expect(service.body).toBe('');
    expect(service.isDecision).toBeFalse();
  });

  it('should open modal and set properties correctly', () => {
    const options: ModalOptions = {
      type: 'error',
      title: 'Error Title',
      body: 'Error body message',
      isDecision: true
    };

    service.openModal(options);

    expect(service.show).toBeTrue();
    expect(service.type).toBe('error');
    expect(service.title).toBe('Error Title');
    expect(service.body).toBe('Error body message');
    expect(service.isDecision).toBeTrue();
  });

  it('should open modal with success type', () => {
    const options: ModalOptions = {
      type: 'success',
      title: 'Success Title',
      body: 'Success message',
      isDecision: false
    };

    service.openModal(options);

    expect(service.show).toBeTrue();
    expect(service.type).toBe('success');
    expect(service.title).toBe('Success Title');
    expect(service.body).toBe('Success message');
    expect(service.isDecision).toBeFalse();
  });

  it('should set and get show property', () => {
    service.show = true;
    expect(service.show).toBeTrue();

    service.show = false;
    expect(service.show).toBeFalse();
  });

  it('should emit event on ok with true value', (done) => {
    service.eventOnOk.subscribe((decision: boolean) => {
      expect(decision).toBeTrue();
      done();
    });

    service.eventOnOk.emit(true);
  });

  it('should emit event on ok with false value', (done) => {
    service.eventOnOk.subscribe((decision: boolean) => {
      expect(decision).toBeFalse();
      done();
    });

    service.eventOnOk.emit(false);
  });

  it('should return correct eventOnOk EventEmitter', () => {
    expect(service.eventOnOk).toBeDefined();
    expect(typeof service.eventOnOk.emit).toBe('function');
    expect(typeof service.eventOnOk.subscribe).toBe('function');
  });
});
