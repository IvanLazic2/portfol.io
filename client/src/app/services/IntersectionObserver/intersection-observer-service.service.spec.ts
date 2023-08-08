import { TestBed } from '@angular/core/testing';

import { IntersectionObserverServiceService } from './intersection-observer-service.service';

describe('IntersectionObserverServiceService', () => {
  let service: IntersectionObserverServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntersectionObserverServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
