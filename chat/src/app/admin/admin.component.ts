import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  user: any;
  users = [{username: "user1"}, {username: "user2"}, {username: "user3"}]; 
  groups = [{id: "g1", name:"Group 1"}, {id: "g2", name:"Group 2"}, {id: "g3", name:"Group 3"}];
  channels = [{id: "c1", name:"Channel 1", gid: "g1"}, {id: "c2", name:"Channel 2", gid: "g1"}, {id: "c3", name:"Channel 3",  gid: "g2"}];
  resultChannels: any[] = [];
  groupMembers = [{username: "user1", gid: "g1"}, {username: "user2", gid: "g2"}, {username: "user3", gid: "g3"}];
  channelMembers = [{username: "user1", cid: "c1"}, {username: "user2", cid: "c2"}, {username: "user3", cid: "c3"}];
  resultMembers: any[] = [];
  selectedGroup = "";
  public isCollapsed = true;
  public isCollapsedC = true;

  constructor(private authService: AuthService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.user = this.authService.getSession(); // get user session data
  }

  createGroup(id: string, name: string): void {
    if (this.groups.find(g => g.id == id)) { // Check if already exist
      alert("ID already taken!");
    } else {
      this.groups.push({id: id, name: name});
    }
  }

  createChannel(id: string, name: string): void {
    if (this.channels.find(g => g.id == id)) { // Check if already exist
      alert("ID already taken!");
    } else {
      this.channels.push({id: id, name: name, gid: this.selectedGroup});
    }
  }

  removeGroup(id: string): void {
    this.groups = this.groups.filter(g => g.id != id)
  }

  removeChannel(id: string): void {
    this.channels = this.channels.filter(c => c.id != id)
  }

  // Open a modal to show a list of channels
  showChannels(content: any, id: string): void {
    this.selectedGroup = id;
    this.modalService.open(content, { size: 'lg' });
  }

  // Open a modal to show a list of users
  showMembers(content: any, filter: string, id: string): void {
    let targetMembers;
    if (filter == "group") { // Show only from the group
      targetMembers = this.groupMembers.filter(m => m.gid == id);
    } else if (filter == "channel") { // Show only from the channel
      targetMembers = this.channelMembers.filter(m => m.cid == id);
    } else { // Show all
      targetMembers = this.users;
    }
    this.resultMembers = targetMembers;
    this.modalService.open(content, { size: 'lg' });
  }


  createUser(username: string, email: string, password: string): void {
    if (this.users.find(u => u.username == username)) { // Check if already exist
      alert("Username already taken!");
    } else {
      this.users.push({username: username});
    }
  }

  // Delete one user
  deleteUser(user: any) {
    if (this.user.role == 'superAdmin') {
      this.users = this.users.filter(u => u.username != user);
    } else {
      alert("You don't have a permission for this action.");
    }
  }

  // Delete all users except the current user
  deleteAllUsers() {
    if (this.user.role == 'superAdmin') {
      this.users = this.users.filter(u => u.username == this.user.username);
    } else {
      alert("You don't have a permission for this action.");
    }
    
  }

}
