import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // To get/save session
import { DatabaseService } from '../services/database.service';
import { ImguploadService } from '../services/imgupload.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  user: any;
  groups: any[] = [];
  channels: any[] = [];
  resultChannels: any[] = [];
  groupMembers: any[] = [];
  channelMembers: any[] = [];
  userGroups: any[] = [];
  imageserver = "";

  constructor(private authService: AuthService, private database: DatabaseService, private imgupload: ImguploadService) { }

  ngOnInit(): void {
    this.user = this.authService.getSession(); // get user session data
    this.imageserver = this.imgupload.imageserver; // Set the image server address
    this.getGroups();
    this.getGroupMember();
  }

  ngDoCheck(): void {
    //this.user = this.authService.getSession(); // get user session data
  }

  getGroups() {
    this.database.getGroups()
    .subscribe((data: any) => {
      if (data) {
        this.groups = data;
        this.generateGroupsByUser(); // Generate group list for the user
      } else {
        alert("Groups data failed.");
      }
    });
  }

  getGroupMember() {
    this.database.getGroupMember()
    .subscribe((data: any) => {
      if (data) {
        this.groupMembers = data;
      } else {
        alert("Group member data failed.");
      }
    });
  }

  // Logout and clear session
  logout():void {
    this.authService.logout(); // Logout via service
  }

  // Make a list of groups that the user belongs to
  generateGroupsByUser():void {
    if(this.user && (this.user.role == "superAdmin" || this.user.role == "groupAdmin")) {
      this.userGroups = this.groups;
    } else {
      this.groupMembers.filter(i => i.username == this.user.username).forEach(j => this.userGroups.push(this.groups.find(g => g.id == j.gid)));
    }
  }
}
