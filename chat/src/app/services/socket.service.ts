import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../models/message';
import io from 'socket.io-client';
const SERVER_URL = 'https://s5251464.elf.ict.griffith.edu.au:3000/chat';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: any;

  constructor() { }

  peerID(peerID: string) {
    this.initSocket();
    this.joinRoom("video");
    this.socket.emit("peerID", peerID);
  }

  // Setup Connection to socket server
  initSocket(){
    this.socket = io(SERVER_URL);
    return ()=>{this.socket.disconnect();}
  }

  // Join a room
  joinRoom(room: string): void {
    this.socket.emit("joinRoom", room);
  }

  // Leave a room
  leaveRoom(room: string): void {
    this.socket.emit("leaveRoom", room);
  }

  // After joined to a room
  joined(next: any) {
    this.socket.on("joined", (res: any) => next(res));
  }

  // Request active user number
  reqnumusers(room:string) {
    this.socket.emit("numusers", room);
  }

  // Receive active user number
  getnumusers(next: any) {
    this.socket.on("numusers", (res: any) => next(res));
  }

  // Request room list
  reqroomList() {
    this.socket.emit("roomlist");
  }
  // Receive room list
  getroomList(next: any) {
    this.socket.on("roomlist", (res: any) => next(res));
  }

  // Get notice
  notice(next: any) {
    this.socket.on("notice", (res: any) => next(res));
  }

  // Emit a message to the socket server
  send(message: Message){
    this.socket.emit('message', message);
  }

  // Listen for "message" events from the socket server
  getMessage(next: any){
    this.socket.on('message', (m: Message) => next(m));
  }
}
