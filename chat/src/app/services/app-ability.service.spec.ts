import { TestBed } from '@angular/core/testing';

import { AppAbilityService } from './app-ability.service';

describe('AppAbilityService', () => {
  let service: AppAbilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppAbilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
