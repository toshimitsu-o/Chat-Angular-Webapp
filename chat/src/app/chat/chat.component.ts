import { assertPlatform, Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { ActivatedRoute } from '@angular/router'
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { AuthService } from '../services/auth.service'; // To get/save session
import { Message } from '../models/message';
import { ImguploadService } from '../services/imgupload.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastService } from '../services/toast.service';

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
  pipe = new DatePipe('en-AU');

  messagecontent: string = "";
  messages: any[] = [];
  ioConnection:any;
  rooms = [];
  room = "";
  roomnotice = "";
  isinRoom = false;
  activeNum = 0;

  selectedfile: any = null;
  imagepath = "";

  constructor(private socketservice: SocketService, private activatedRoute: ActivatedRoute, private router: Router, private database: DatabaseService, private authService: AuthService, private imgupload: ImguploadService, private modalService: NgbModal, public toast: ToastService) { }

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

  ngOnDestroy(): void {
    // Clear toast
    this.toast.clear();
  }

  onClickChannel(channel:string) {
    this.joinroom(channel);
    this.getMessages(channel);
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
        newMessage.date = this.pipe.transform(newMessage.date, 'd MMM y h:mm a')
        this.messages.push(newMessage);
      });
    });
    // Get notice
    this.socketservice.notice((m:any)=>{
      this.roomnotice = m;
      // Show toast
      this.toast.show(this.roomnotice);
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

  // Send image as chat message
  public chatImg(file:string) {
    if(this.room) { // Check in a room
      let newMessage = new Message("image", file, this.user.username, this.room);
      this.socketservice.send(newMessage);
      this.messagecontent = "";
    } else {
      console.log("no message");
    }
  }

  // Get selected file 
  onFileSelected(event: any):void {
    this.selectedfile = event.target.files[0];
  }

  // Upload selected image
  onUpload():void {
    const fd = new FormData();
    fd.append('image', this.selectedfile, this.selectedfile.name);
    this.imgupload.imgupload(fd).subscribe(res => {
      let file: string = res.data.filename;
      // Send the image as a chat message
      this.chatImg(file);
      // Close modal
      this.modalService.dismissAll();
      //this.userimage = this.imageserver + this.imagepath;
    });
  }

  // Open a modal to upload image file
  showImgModal(content: any):void {
    this.modalService.open(content, { size: 'md' });
  }

  // Get messages from database
  getMessages(cid:string):void {
    //let newMessages: any[] = [];
    this.database.getMessages(cid, 10)
    .subscribe((data: any) => {
      if (data) {
        data.forEach((i:any) => {
          this.database.getUser(i.sender).subscribe((data: any) => {
            if (data) {
              i.avatar= data[0].avatar;
            } else {
              console.log("Sender avatar retrival failed.")
            }
            i.date = this.pipe.transform(i.date, 'd MMM y h:mm a')
            this.messages.push(i);
          });
        });
        // newMessages.sort(function(a,b): any{
        //   return Date.parse(a.date) - Date.parse(b.date);
        // });
        // this.messages = newMessages;
      } else {
        alert("Message retrieval failed.");
      }
    });
  }

  // Get all groups
  getGroups():void {
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

  // Get all channels
  getChannels():void {
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

  // Get all channel members
  getChannelMember():void {
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
