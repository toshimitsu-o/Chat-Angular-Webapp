import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImguploadService {

  imageserver = "https://s5251464.elf.ict.griffith.edu.au:3000/images/";

  constructor(private http:HttpClient) { }

  // Image Uploader
  imgupload(fd:any){
    return this.http.post<any>('https://s5251464.elf.ict.griffith.edu.au:3000/api/upload', fd)
      }
}
