import { TestBed } from '@angular/core/testing';

import { ImguploadService } from './imgupload.service';

describe('ImguploadService', () => {
  let service: ImguploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImguploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
