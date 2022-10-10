import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { ActivatedRoute } from '@angular/router'
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { AuthService } from '../services/auth.service'; // To get/save session
import { Message } from '../models/message';
import { ImguploadService } from '../services/imgupload.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [SocketService]
})
export class ChatComponent implements OnInit {
  
  user: any;
  gid: any;
  group: any;
  groupname = "";
  groups: any[] = [];
  cid: any;
  channels: any[] = [];
  channelsInGroup: any[] = [];
  channelMembers: any[] = [];
  userChannels: any[] = [];
  imageserver:string = "";

  messagecontent: string = "";
  messages: any[] = [];
  ioConnection:any;
  rooms = [];
  room = "";
  roomnotice = "";
  isinRoom = false;
  activeNum = 0;

  constructor(private socketservice: SocketService, private activatedRoute: ActivatedRoute, private router: Router, private database: DatabaseService, private authService: AuthService, private imgupload: ImguploadService) { }

  ngOnInit(): void {
    this.user = this.authService.getSession(); // get user session data
    this.imageserver = this.imgupload.imageserver; // Set the image server address
    this.initIoConnection();
    this.getGroups();
    this.getChannels();
    this.getChannelMember();
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

  onClickChannel(channel:string) {
    this.joinroom(channel);
  }

  // Initialise connection
  private initIoConnection() {
    this.socketservice.initSocket();
    //this.socketservice.getMessage((m)=>{this.messages.push(m)});
    // this.socketservice.getroomList(d => {
    //   this.rooms = JSON.parse(d)
    // });
    // Get room list
    this.socketservice.reqroomList();
    this.socketservice.getroomList((m: any) => {
      this.rooms = JSON.parse(m);
    });
    // Recieve joined status
    this.socketservice.joined((m:any)=>{
      this.room = m;
      //alert("joined" + m);
    });
    // Get messages
    this.socketservice.getMessage((m: Message) => {
      let newMessage: any = m;
      this.database.getUser(m.sender).subscribe((data: any) => {
        if (data) {
          newMessage.avatar= data[0].avatar;
        } else {
          console.log("Sender avatar retrival failed.")
        }
        this.messages.push(newMessage);
      });
    });
    // Get notice
    this.socketservice.notice((m:any)=>{
      this.roomnotice = m;
    });
  }

  // Join the room
  joinroom(channel:string):void {
    // Leave room before joining another
    if (this.room != "" && this.room != channel) {
      this.leaveRoom();
    }
    this.socketservice.joinRoom(channel);
    // Get number of users in the room
    this.socketservice.reqnumusers(this.room);
    this.socketservice.getnumusers((m: any) => {
      this.activeNum = m;
    });
  }

  // Leave the room
  leaveRoom():void {
    if (this.room != "") { // If currently in a room
      this.socketservice.leaveRoom(this.room);
      this.messages = [];
      this.rooms = [];
      this.room = "";
      this.roomnotice = "";
      this.isinRoom = false;
      this.activeNum = 0;
    }
  }

  // Send chat message
  public chat() {
    if(this.messagecontent != "" && this.room) { // Check there is a message to send and in a room
      let newMessage = new Message("text", this.messagecontent, this.user.username, this.room);
      this.socketservice.send(newMessage);
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
