import { TestBed } from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import { ImguploadService } from './imgupload.service';

describe('ImguploadService', () => {
  let service: ImguploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient]
    });
    service = TestBed.inject(ImguploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upload image', () => {
    const fd = new FormData();
    fd.append('image', "file", "file.png");
    expect(service.imgupload(fd)).toBeTruthy();
  });
});
