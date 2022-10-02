import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { User } from '../models/user';
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
  groups: any[] = [];
  channels: any[] = [];
  resultChannels: any[] = [];
  groupMembers: any[] = [];
  channelMembers: any[] = [];
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

  ngOnInit() {
    this.user = this.authService.getSession(); // get user session data
    if (this.user.role == "superAdmin" || this.user.role == "groupAdmin") {
      this.getUsers();
      this.getGroups();
      this.getChannels();
      this.getGroupMember();
      this.getChannelMember();
    }
  }

  getGroups() {
    this.httpClient.get(BACKEND_URL + '/group', httpOptions)
    .subscribe((data: any) => {
      if (data) {
        this.groups = data;
      } else {
        alert("Groups data failed.");
      }
    });
  }

  getChannels() {
    this.httpClient.get(BACKEND_URL + '/channel', httpOptions)
    .subscribe((data: any) => {
      if (data) {
        this.channels = data;
      } else {
        alert("Channels data retrieval failed.");
      }
    });
  }

  getGroupMember() {
    this.httpClient.get(BACKEND_URL + '/member/group', httpOptions)
    .subscribe((data: any) => {
      if (data) {
        this.groupMembers = data;
      } else {
        alert("Group member data failed.");
      }
    });
  }

  getChannelMember() {
    this.httpClient.get(BACKEND_URL + '/member/channel/', httpOptions)
    .subscribe((data: any) => {
      if (data) {
        this.channelMembers = data;
      } else {
        alert("Channel member data failed.");
      }
    });
  }

  createGroup(id: string, name: string): void {
    if (this.groups.find(g => g.id == id)) { // Check if already exist
      alert("ID already taken!");
    } else {
      let newGroup = {id: id, name: name};
      this.httpClient.post<any>(BACKEND_URL + '/group', newGroup, httpOptions)
      .subscribe((data: any) => {
        if (data.err == null) {
          this.getGroups();
        } else {
          alert("Group creation failed.");
        }
      });
    }
  }

  createChannel(id: string, name: string): void {
    if (this.channels.find(g => g.id == id)) { // Check if already exist
      alert("ID already taken!");
    } else {
      let newChannel = {id: id, name: name, gid: this.selectedGroup};
      this.httpClient.post<any>(BACKEND_URL + '/channel', newChannel, httpOptions)
      .subscribe((data: any) => {
        if (data.err == null) {
          this.getChannels();
        } else {
          alert("Channel creation failed.");
        }
      });
    }
  }

  // Delete the group and channels under the group
  deleteGroup(id: string): void {
    this.httpClient.delete(BACKEND_URL + '/group/' + id, httpOptions)
    .subscribe((data: any) => {
      if (data) {
        this.groups = data;
        // Delete all channels under the group
        this.channels.filter(c => c.gid == id).forEach(i => {
        this.deleteChannel(i.id);
    });
      } else {
        alert("User deletion failed.");
      }
    });
  }

  // Delete the channel
  deleteChannel(id: string): void {
    this.httpClient.delete(BACKEND_URL + '/channel/' + id, httpOptions)
    .subscribe((data: any) => {
      if (data) {
        this.channels = data;
      } else {
        alert("User deletion failed.");
      }
    });
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
    } else if (this.memberFilter == "channel") {
      this.removeUserFromChannel(user, this.selectedChannel, this.selectedGroup);
    } else {
      alert("Group/Channel not specified.");
    }
  }

  // Get users data from server
  getUsers() {
    this.httpClient.get(BACKEND_URL + '/admin/users', httpOptions)
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
      let newUser = new User(username, email, "user", password);
      this.httpClient.post<User>(BACKEND_URL + '/admin/users', newUser, httpOptions)
      .subscribe((data: any) => {
        if (data.err == null) {
          this.getUsers();
        } else {
          alert("User creation failed.");
        }
      });
    }
  }

  // Update user's role
  updateUserRole(user: string, role: string):void {
    const target = this.users.find(u => u.username == user);
    if (target) {
      target.role = role;
      this.httpClient.put<User>(BACKEND_URL + '/admin/users', target,  httpOptions)
      .subscribe((data: any) => {
        this.users = data;
      });
    }
  }

  // Delete one user
  deleteUser(user: string) {
    if (this.user.role == 'superAdmin') { // Check the user role
      this.httpClient.delete(BACKEND_URL + '/admin/users/' + user + '/-', httpOptions)
      .subscribe((data: any) => {
        if (data) {
          this.users = data;
        } else {
          alert("User deletion failed.");
        }
      });
    } else {
      alert("You don't have a permission for this action.");
    }
  }

  // Delete all users except the current user
  deleteAllUsers() {
    if (this.user.role == 'superAdmin') {
      this.httpClient.delete(BACKEND_URL + '/admin/users/all/' + this.user.username, httpOptions)
      .subscribe((data: any) => {
        if (data) {
          this.users = data;
        } else {
          alert("User deletion failed.");
        }
      });
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
    this.httpClient.delete(BACKEND_URL + '/member/group/' + user + '/' + group, httpOptions)
    .subscribe((data: any) => {
      if (data) {
        this.groupMembers = data;
        this.updateGroupsByUser(user); // Update the list view
        // Remove the user from chanels under the group
        this.channels.filter(c => c.gid == group).forEach(i => {
          this.removeUserFromChannel(user, i.id, group);
        });
        this.resultMembers = this.groupMembers.filter(m => m.gid == this.selectedGroup); // Update the member list for display
      } else {
        alert("User deletion failed.");
      }
    });
  }

  // Add the user to the group
  addUserToGroup(user: string, group: string) {
    let item = {username: user, gid: group};
    this.httpClient.post<any>(BACKEND_URL + '/member/group', item, httpOptions)
    .subscribe((data: any) => {
      if (data) {
        this.groupMembers = data;
        this.updateGroupsByUser(user); // To update list view
      } else {
        alert("Member addition failed.");
      }
    });
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
    this.httpClient.delete(BACKEND_URL + '/member/channel/' + user + '/' + channel, httpOptions)
    .subscribe((data: any) => {
      if (data) {
        this.channelMembers = data;
        this.updateChannelsByUser(user, group); // Update the list view
        this.resultMembers = this.channelMembers.filter(m => m.cid == this.selectedChannel);
      } else {
        alert("User deletion failed.");
      }
    });
  }

  // Add the user to the group
  addUserToChannel(user: string, channel: string, group: string) {
    let item = {username: user, cid: channel};
    this.httpClient.post<any>(BACKEND_URL + '/member/channel', item, httpOptions)
    .subscribe((data: any) => {
      if (data) {
        this.channelMembers = data;
        this.updateChannelsByUser(user, group); // To update list view
      } else {
        alert("Member addition failed.");
      }
    });
  }
}