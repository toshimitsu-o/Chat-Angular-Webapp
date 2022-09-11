import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // To get/save session

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  user: any;
  groups = [{id: "g1", name:"Group 1"}, {id: "g2", name:"Group 2"}, {id: "g3", name:"Group 3"}];
  channels = [{id: "c1", name:"Channel 1", gid: "g1"}, {id: "c2", name:"Channel 2", gid: "g1"}, {id: "c3", name:"Channel 3",  gid: "g2"}];
  resultChannels: any[] = [];
  groupMembers = [{username: "user1", gid: "g1"}, {username: "user2", gid: "g2"}, {username: "user3", gid: "g3"}];
  channelMembers = [{username: "user1", cid: "c1"}, {username: "user2", cid: "c2"}, {username: "user3", cid: "c3"}];
  userGroups: any[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.getSession(); // get user session data
    if(this.user && (this.user.role == "superAdmin" || this.user.role == "groupAdmin")) {
      this.userGroups = this.groups;
    } else {
      this.generateGroupsByUser();
    }
  }

  ngDoCheck(): void {
    //this.user = this.authService.getSession(); // get user session data
  }

  // Logout and clear session
  logout():void {
    this.authService.logout(); // Logout via service
  }

  // Make a list of groups that the user belongs to
  generateGroupsByUser():void {
    this.groupMembers.filter(i => i.username == this.user.username).forEach(j => this.userGroups.push(this.groups.find(g => g.id == j.gid)));
  }
}
