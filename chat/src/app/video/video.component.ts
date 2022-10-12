import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Peer } from 'peerjs';
//import { v4 as uuidv4 } from 'uuid';
import { SocketService } from '../services/socket.service';
import { AuthService } from '../services/auth.service'; // To get/save session

interface VideoElement {
  muted: boolean;
  srcObject: MediaStream;
  userId: string;
}

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  ownID: string = "";
  videos: VideoElement[] = [];

  //myPeerID = uuidv4();
  myPeerID: string;
  myPeer: any;

  user: any;

  roomnotice = "";

  constructor(private socketService: SocketService, private authService: AuthService) { 
  this.user = this.authService.getSession(); // get user session data
  this.myPeerID = this.user.username;
    // Peer
  this.myPeer = new Peer(this.myPeerID, {
    host: "s5251464.elf.ict.griffith.edu.au",
    secure: true,
    port: 3001,
    path: "/"
  });
  
  }

  ngOnInit(): void {
    
    this.socketService.peerID(this.myPeerID);
    this.socketService.notice((m:any)=>{
      this.roomnotice = m;
      // Show toast
      alert(this.roomnotice);
    });
    // Ask browser for permissions
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    })
    .catch((err) => {
      console.error('[Error] Not able to retrieve user media:', err);
      return null;
    })
    .then((stream:any) => { // Add stream
      if(stream) {
        this.addMyVideo(stream);
      }

      this.myPeer.on('call', (call:any) => { // When someone calls
        console.log('receiving call...', call);
        call.answer(stream); // Answer

        call.on('stream', (otherUserVideoStream: MediaStream) => {
          console.log('receiving other stream', otherUserVideoStream);
          this.addOtherUserVideo(call.metadata.userId, otherUserVideoStream);
        });

        call.on('error', (err:any) => {
          console.error(err);
        });

      });

      this.socketService.socket.on('peerID', (userId: any) => {
        console.log('Receiving user-connected event', `Calling ${userId}`);

        // Let some time for new peers to be able to answer
        setTimeout(() => {
          const call = this.myPeer.call(userId, stream, {
            metadata: { userId: this.myPeerID }
          });

          call.on('stream', (otherUserVideoStream: MediaStream) => {
            this.addOtherUserVideo(userId, otherUserVideoStream);
          });

          call.on('close', () => {
            // Remove the video
            this.videos = this.videos.filter(video => video.userId !== userId);
          });
        }, 1000);
      });
    });
  }

  // Add my video object to videos array
  addMyVideo(stream: MediaStream) {
    this.videos.push({
      muted: true,
      srcObject: stream,
      userId: this.myPeerID
    });
  }

  // Add other users video
  addOtherUserVideo(uid:string, stream: MediaStream) {
    const alreadyExisting = this.videos.some(video => video.userId == uid);
    if (alreadyExisting) {
      console.log("already in videos", this.videos, uid);
    } else {
      this.videos.push({
        muted: false,
        srcObject: stream,
        userId: uid
      });
    }
    
  }

  // Play video on load
  onLoadedMetadata(event: Event) {
    (event.target as HTMLVideoElement).play();
  }

}
