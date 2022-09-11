import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Userobj } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};
const BACKEND_URL = "http://localhost:3000";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  user: any;
  users: any[] = []; 
  groups = [{id: "g1", name:"Group 1"}, {id: "g2", name:"Group 2"}, {id: "g3", name:"Group 3"}];
  channels = [{id: "c1", name:"Channel 1", gid: "g1"}, {id: "c2", name:"Channel 2", gid: "g1"}, {id: "c3", name:"Channel 3",  gid: "g2"}];
  resultChannels: any[] = [];
  groupMembers = [{username: "user1", gid: "g1"}, {username: "user2", gid: "g2"}, {username: "user3", gid: "g3"}];
  channelMembers = [{username: "user1", cid: "c1"}, {username: "user2", cid: "c2"}, {username: "user3", cid: "c3"}];
  resultMembers: any[] = [];
  memberFilter = "";
  selectedGroup = "";
  selectedChannel = "";
  selectedUser = "";
  groupsByUser: any[] = [];
  channelsByUser: any[] = [];
  public isCollapsed = true;
  public isCollapsedC = true;

  constructor(private authService: AuthService, private modalService: NgbModal, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.user = this.authService.getSession(); // get user session data
    if (this.user.role == "superAdmin" || this.user.role == "groupAdmin") {
      this.getUsers();
    }
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

  // Delete the group and channels under the group
  deleteGroup(id: string): void {
    this.groups = this.groups.filter(g => g.id != id);
    // Delete all channels under the group
    this.channels.filter(c => c.gid == id).forEach(i => {
      this.deleteChannel(i.id);
    });
  }

  // Delete the channel
  deleteChannel(id: string): void {
    this.channels = this.channels.filter(c => c.id != id);
  }

  // Open a modal to show a list of channels
  showChannels(content: any, id: string): void {
    this.selectedGroup = id;
    this.modalService.open(content, { size: 'lg' });
  }

  // Open a modal to show a user list of group/channel
  showMembers(content: any, filter: string, id: string): void {
    if (filter == "group") { // Show only from the group
      this.selectedGroup = id;
      this.resultMembers = this.groupMembers.filter(m => m.gid == id);
    } else if (filter == "channel") { // Show only from the channel
      this.selectedChannel = id;
      this.resultMembers = this.channelMembers.filter(m => m.cid == id);
    } else { // Show all
      this.resultMembers = this.users;
    }
    this.memberFilter = filter;
    this.modalService.open(content, { size: 'lg' });
  }

  // remove the member from group/channel
  removeMember(user: string):void {
    if (this.memberFilter == "group") { // Check filter mode
      this.removeUserFromGroup(user, this.selectedGroup);
      this.resultMembers = this.groupMembers.filter(m => m.gid == this.selectedGroup); // Update the member list for display
    } else if (this.memberFilter == "channel") {
      this.removeUserFromChannel(user, this.selectedChannel, this.selectedGroup);
      this.resultMembers = this.channelMembers.filter(m => m.cid == this.selectedChannel);
    } else {
      alert("Group/Channel not specified.");
    }
  }

  // Get users data from server
  getUsers() {
    this.httpClient.get(BACKEND_URL + '/admin/users/get', httpOptions)
    .subscribe((data: any) => {
      if (data) {
        this.users = data;
      } else {
        alert("Users data failed.");
      }
    });
  }

  // Create a new user
  createUser(username: string, email: string, password: string): void {
    if (this.users.find(u => u.username == username)) { // Check if already exist
      alert("Username already taken!");
    } else {
      let newUser = {username: username, email: email, role: "user"};
      this.httpClient.post<Userobj[]>(BACKEND_URL + '/admin/users/create', newUser, httpOptions)
      .subscribe((data: any) => {
        if (data) {
          this.users = data;
        } else {
          alert("User creation failed.");
        }
      });
    }
  }

  // Delete one user
  deleteUser(user: string) {
    if (this.user.role == 'superAdmin') { // Check the user role
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

  // Open a modal to show list of groups that selected user belong to
  showGroupsByUser(content: any, user: string) {
    this.selectedUser = user;
    this.updateGroupsByUser(user); // Update the array
    this.modalService.open(content, { size: 'lg' });
  }

  // Add groups to array with Boolean wether the user belongs to the group or not
  updateGroupsByUser(user: string) {
    this.groupsByUser = []; // Reset the array
    this.groups.forEach( i => {
      // Get group details with Boolean wether the user belongs to or not
      let group = {id: i.id, name: i.name, member: this.groupMembers.some(g => g.username == user && g.gid == i.id)};
      this.groupsByUser.push(group); // Add each group to the array
    });;
  }

  // Remove the user from the group
  removeUserFromGroup(user: string, group: string):void {
    this.groupMembers = this.groupMembers.filter(u => {
      if (u.username != user) {
        return true;
      } else if (u.gid != group) {
        return true;
      } else {
        return false;
      }
    });
    this.updateGroupsByUser(user);
    // Remove the user from chanels under the group
    this.channels.filter(c => c.gid == group).forEach(i => {
      this.removeUserFromChannel(user, i.id, group);
    });
  }

  // Add the user to the group
  addUserToGroup(user: string, group: string) {
    let item = {username: user, gid: group};
    this.groupMembers.push(item);
    this.updateGroupsByUser(user);
  }

   // Open a modal to show list of Channels that selected user belong to
   showChannelsByUser(content: any, user: string, group: string) {
    this.selectedUser = user;
    this.updateChannelsByUser(user, group); // Update the array
    this.modalService.open(content, { size: 'lg' });
  }

   // Add channels to array with Boolean wether the user belongs to the channels or not
   updateChannelsByUser(user: string, group: string) {
    this.channelsByUser = []; // Reset the array
    this.channels.filter(c => c.gid == group).forEach( i => { // Make an array of channels under the group
      // Get channel details with Boolean wether the user belongs to or not
      let channel = {id: i.id, name: i.name, gid: group, member: this.channelMembers.some(j => j.username == user && j.cid == i.id)};
      this.channelsByUser.push(channel); // Add each group to the array
    });;
  }

  // Remove the user from the group
  removeUserFromChannel(user: string, channel: string, group: string):void {
    this.channelMembers = this.channelMembers.filter(u => {
      if (u.username != user) {
        return true;
      } else if (u.cid != channel) {
        return true;
      } else {
        return false;
      }
    });
    this.updateChannelsByUser(user, group);
  }

  // Add the user to the group
  addUserToChannel(user: string, channel: string, group: string) {
    let item = {username: user, cid: channel};
    this.channelMembers.push(item);
    this.updateChannelsByUser(user, group);
  }

  // Update user's role
  updateUserRole(user: string, role: string):void {
    const target = this.users.find(u => u.username == user);
    if (target) {
      target.role = role;
    }
  }
}