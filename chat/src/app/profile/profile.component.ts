import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service'; // To get/save session
import { ImguploadService } from '../services/imgupload.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [AuthService]
})
export class ProfileComponent implements OnInit {

  user: any;
  selectedfile: any = null;
  imagepath = "";
  imageserver = "";
  userimage = "";

  constructor(private router: Router, private authService: AuthService, private imgupload: ImguploadService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.user = this.authService.getSession(); // get user session data
    this.imageserver = this.imgupload.imageserver; // Set the image server address
    this.userimage = this.imageserver + this.imagepath;
  }

  save() {
    // Save to session storage
    this.authService.userUpdate(this.user);
  }

  // Get selected file 
  onFileSelected(event: any) {
    this.selectedfile = event.target.files[0];
  }

  // Upload selected image
  onUpload() {
    const fd = new FormData();
    fd.append('image', this.selectedfile, this.selectedfile.name);
    this.imgupload.imgupload(fd).subscribe(res => {
      this.user.avatar = res.data.filename;
      // Save to database and session
      this.save();
      // Close modal
      this.modalService.dismissAll();
      //this.userimage = this.imageserver + this.imagepath;
    });
  }

   // Open a modal to upload image file
   showModal(content: any) {
    this.modalService.open(content, { size: 'md' });
  }

}
