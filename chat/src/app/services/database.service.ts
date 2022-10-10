import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Group } from '../models/group';
import { Channel } from '../models/channel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};
const BACKEND_URL = "http://localhost:3000";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private httpClient: HttpClient) { }

  // GET functions

  getUser(user:string): any {
    return this.httpClient.get(BACKEND_URL + '/user/' + user, httpOptions);
  }

  getMessages(cid:string, limit:number): any {
    return this.httpClient.get(BACKEND_URL + '/messages/' + cid + '/' + limit, httpOptions);
  }

  getUsers(): any {
    return this.httpClient.get(BACKEND_URL + '/admin/users', httpOptions);
  }

  getGroups(): any {
    return this.httpClient.get(BACKEND_URL + '/group', httpOptions);
  }

  getChannels(): any {
    return this.httpClient.get(BACKEND_URL + '/channel', httpOptions);
  }

  getGroupMember(): any {
    return this.httpClient.get(BACKEND_URL + '/member/group', httpOptions);
  }

  getChannelMember(): any {
    return this.httpClient.get(BACKEND_URL + '/member/channel/', httpOptions);
  }

  // POST functions

  postUser(item:any): any {
    this.httpClient.post<User>(BACKEND_URL + '/admin/users', item, httpOptions)
  }

  postGroup(item:object): any {
    return this.httpClient.post<Group>(BACKEND_URL + '/group', item, httpOptions);
  }
  postChannel(item:object): any {
    return this.httpClient.post<Channel>(BACKEND_URL + '/channel', item, httpOptions);
  }

  postGroupMember(item:object): any {
    return this.httpClient.post<User>(BACKEND_URL + '/member/group', item, httpOptions);
  }

  postChannelMember(item:object): any {
    return this.httpClient.post<User>(BACKEND_URL + '/member/channel', item, httpOptions);
  }

  // PUT functions

  putUser(item:object): any {
    return this.httpClient.put<User>(BACKEND_URL + '/admin/users', item,  httpOptions)
  }

  // DELETE functions

  deleteUser(id:string): any {
    return this.httpClient.delete(BACKEND_URL + '/admin/users/' + id + '/-', httpOptions);
  }

  deleteAllUsers(id:string): any {
    this.httpClient.delete(BACKEND_URL + '/admin/users/all/' + id, httpOptions)
  }

  deleteGroup(id:string): any {
    return this.httpClient.delete(BACKEND_URL + '/group/' + id, httpOptions);
  }

  deleteChannel(id:string): any {
    return this.httpClient.delete(BACKEND_URL + '/channel/' + id, httpOptions);
  }

  deleteGroupMember(user:string, gid:string): any {
    return this.httpClient.delete(BACKEND_URL + '/member/group/' + user + '/' + gid, httpOptions)
  }

  deleteChannelMember(user:string, cid:string): any {
    return this.httpClient.delete(BACKEND_URL + '/member/channel/' + user + '/' + cid, httpOptions);
  }
}
