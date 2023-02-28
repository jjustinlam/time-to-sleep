import { TestBed } from '@angular/core/testing';

import { PersonalModelService } from './personal-model.service';

describe('PersonalModelService', () => {
  let service: PersonalModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
