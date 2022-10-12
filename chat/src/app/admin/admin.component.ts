import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { User } from '../models/user';
import { DatabaseService } from '../services/database.service';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

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

  formG: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
  });
  submitted = false;

  formU: FormGroup = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });
  submittedU = false;

  constructor(private authService: AuthService, private modalService: NgbModal, private database: DatabaseService,private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.user = this.authService.getSession(); // get user session data
    if (this.user.role == "superAdmin" || this.user.role == "groupAdmin") {
      this.getUsers();
      //this.getGroups();
      this.getGroups();
      this.getChannels();
      this.getGroupMember();
      this.getChannelMember();
    }

    this.formG = this.formBuilder.group(
      {
        id: [
          '',
          [
            Validators.required
          ]
        ],
        name: [
          '',
          [
            Validators.required
          ]
        ],
      }
    );

    this.formU = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required
          ]
        ],
        email: [
          '',
          [
            Validators.required
          ]
        ],
        password: [
          '',
          [
            Validators.required
          ]
        ],
      }
    );

  }

  get f(): { [key: string]: AbstractControl } {
    return this.formG.controls;
  }

  get fU(): { [key: string]: AbstractControl } {
    return this.formU.controls;
  }
  
  // Get goup list from database
  getGroups() {
    this.database.getGroups()
    .subscribe((data: any) => {
        if (data) {
          this.groups = data;
        } else {
          alert("Groups data failed.");
        }
      });
  }

  // Get channel list from database
  getChannels() {
    this.database.getChannels()
    .subscribe((data: any) => {
      if (data) {
        this.channels = data;
      } else {
        alert("Channels data retrieval failed.");
      }
    });
  }

  // Get goup member list from database
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

  // Get channel list from database
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

  // Add new group to save to database
  createGroup(id: string, name: string): void {
    this.submitted = true;
    if (this.formG.invalid) {
      return;
    }
    id = id.replace(/\s/g, '-'); // Replace white space with -
    if (this.groups.find(g => g.id == id)) { // Check if already exist
      alert("ID already taken!");
    } else {
      let item = {id: id, name: name};
      this.database.postGroup(item)
      .subscribe((data: any) => {
        if (data.err == null) {
          this.getGroups();
        } else {
          alert("Group creation failed.");
        }
      });
    }
  }

  // Add new channle and save to database
  createChannel(id: string, name: string): void {
    id = id.replace(/\s/g, '-'); // Replace white space with -
    if (this.channels.find(g => g.id == id)) { // Check if already exist
      alert("ID already taken!");
    } else {
      let item = {id: id, name: name, gid: this.selectedGroup};
      this.database.postChannel(item)
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
    this.database.deleteGroup(id)
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
    this.database.deleteChannel(id)
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
    this.database.getUsers()
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
    this.submittedU = true;
    if (this.formU.invalid) {
      return;
    }
    username = username.replace(/\s/g, '-'); // Replace white space with -
    if (this.users.find(u => u.username == username)) { // Check if already exist
      alert("Username already taken!");
    } else {
      let newUser = new User(username, email, "user", password);
      this.database.postUser(newUser)
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
      this.database.putUser(target)
      .subscribe((data: any) => {
        this.users = data;
      });
    }
  }

  // Delete one user
  deleteUser(user: string) {
    if (this.user.role == 'superAdmin') { // Check the user role
      this.database.deleteUser(user)
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
      this.database.deleteAllUsers(this.user.username)
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
    this.database.deleteGroupMember(user, group)
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
    this.database.postGroupMember(item)
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
    this.database.deleteChannelMember(user, channel)
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
    this.database.postChannelMember(item)
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