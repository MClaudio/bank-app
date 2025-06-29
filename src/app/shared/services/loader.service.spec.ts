import { TestBed } from '@angular/core/testing';
import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set loader to true when showLoader is called', () => {
    service.showLoader();
    expect(service.loader).toBeTrue();
  });

  it('should set loader to false when offLoader is called', () => {
    service.offLoader();
    expect(service.loader).toBeFalse();
  });

  it('should return the correct value of loader', () => {
    expect(service.loader).toBeTrue();

    service.offLoader();
    expect(service.loader).toBeFalse();

    service.showLoader();
    expect(service.loader).toBeTrue();
  });
});
