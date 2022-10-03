import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // To get/save session
import { DatabaseService } from '../services/database.service';

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

  constructor(private authService: AuthService, private database: DatabaseService) { }

  ngOnInit(): void {
    this.user = this.authService.getSession(); // get user session data
    this.getGroups("-");
    this.getChannels("-", "-");
    this.getGroupMember();
    this.getChannelMember();
  }

  ngDoCheck(): void {
    //this.user = this.authService.getSession(); // get user session data
  }

  getGroups(gid: any) {
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

  getChannels(gid: any, cid: any) {
    this.database.getChannels()
    .subscribe((data: any) => {
      if (data) {
        this.channels = data;
      } else {
        alert("Channels data failed.");
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

  getChannelMember() {
    this.database.getChannelMember()
    .subscribe((data: any) => {
      if (data) {
        this.channelMembers = data;
      } else {
        alert("Channel member data failed.");
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
