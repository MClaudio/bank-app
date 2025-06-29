import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';
import { ModalService } from '../../services/modal.service';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let modalService: ModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
      providers: [{ provide: ModalService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(ModalService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return show from ModalService', () => {
    modalService.show = true;
    expect(component.show).toBeTrue();
  });

  it('should set show in ModalService', () => {
    component.show = false;
    expect(modalService.show).toBeFalse();
  });

  it('should emit eventOnOk and close the modal on onOk', () => {
    const emitSpy = spyOn(modalService.eventOnOk, 'emit');
    component.onOk();
    expect(emitSpy).toHaveBeenCalledWith(true);
    expect(component.show).toBeFalse();
  });
});
