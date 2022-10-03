import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { ActivatedRoute } from '@angular/router'
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { AuthService } from '../services/auth.service'; // To get/save session

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [SocketService]
})
export class ChatComponent implements OnInit {
  messagecontent: string = "";
  messages: string[] = [];
  ioConnection:any;
  user: any;
  gid: any;
  group: any;
  groupname = "";
  groups: any[] = [];
  channels: any[] = [];
  channelsInGroup: any[] = [];
  channelMembers: any[] = [];
  userChannels: any[] = [];

  constructor(private socketservice: SocketService, private activatedRoute: ActivatedRoute, private router: Router, private database: DatabaseService, private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.getSession(); // get user session data
    this.getGroups();
    this.getChannels();
    this.getChannelMember();
    this.initIoConnection();
    // Subscribe to param
    this.activatedRoute.paramMap.subscribe(params => {
      this.gid = params.get("gid"); // Get Parameter from route
      // Find the group data for the current group
      this.group = this.groups.find(g => g.id == this.gid);
      this.groupname = this.group.name;
      this.channelsInGroup = this.channels.filter(c => c.gid == this.gid);
      this.generateChannelByUser();
    });
  }

  // Initialise connection
  private initIoConnection() {
    this.socketservice.initSocket();
    this.ioConnection = this.socketservice.getMessage()
    .subscribe((message: any) => {
      // Add new message to the messages array
      this.messages.push(message)
    });
  }

  // Send chat message
  public chat() {
    if(this.messagecontent) {
      // Check there is a message to send
      this.socketservice.send(this.messagecontent);
      this.messagecontent = "";
    } else {
      console.log("no message");
    }
  }

  getGroups() {
    this.database.getGroups()
    .subscribe((data: any) => {
      if (data) {
        this.groups = data;
        this.group = this.groups.find(g => g.id == this.gid);
        this.groupname = this.group.name;
      } else {
        alert("Groups data failed.");
      }
    });
  }

  getChannels() {
    this.database.getChannels()
    .subscribe((data: any[]) => {
      if (data) {
        this.channels = data;
        this.channelsInGroup = this.channels.filter(c => c.gid == this.gid);
      } else {
        alert("Channels data failed.");
      }
    });
  }

  getChannelMember() {
    this.database.getChannelMember()
    .subscribe((data: any) => {
      if (data) {
        this.channelMembers = data;
        this.generateChannelByUser();
      } else {
        alert("Channel member data failed.");
      }
    });
  }

    // Make a list of channels that the user belongs to
    generateChannelByUser():void {
      if(this.user && (this.user.role == "superAdmin" || this.user.role == "groupAdmin")) {
        this.userChannels = this.channelsInGroup;
      } else {
        this.channelMembers.filter(i => i.username == this.user.username).forEach(j => this.userChannels.push(this.channelsInGroup.find(c => c.id == j.cid)));
      }
    }

}
