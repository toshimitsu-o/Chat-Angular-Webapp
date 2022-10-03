import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImguploadService {

  imageserver = "http://localhost:3000/images/";

  constructor(private http:HttpClient) { }

  // Image Uploader
  imgupload(fd:any){
    return this.http.post<any>('http://localhost:3000/api/upload', fd)
      }
}
