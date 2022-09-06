import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';

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

  constructor(private socketservice: SocketService) { }

  ngOnInit(): void {
    this.initIoConnection();
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

}
