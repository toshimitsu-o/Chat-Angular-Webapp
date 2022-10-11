import { Injectable } from '@angular/core';

export class DatabaseServiceMock {

  constructor() { }

  // GET functions

  getUser(user:string): any {
    return {username: "test", email: "test@test.com", role: "user", pwd: "pass", avatar: ""};
  }

  getMessages(cid:string, limit:number): any {
    return [{
      type:"text",
      body:"hello",
      sender: "sadmin",
      to:"c1",
      date:"2022-10-10T10:35:50.003+00:00"
    }, 
    {
      type:"text",
      body:"hello hello",
      sender: "sadmin",
      to:"c1",
      date:"2022-10-11T10:35:50.003+00:00"
    }];
  }

  getUsers(): any {
    return [
      {username: "test", email: "test@test.com", role: "user", pwd: "pass", avatar: ""},
    {username: "test2", email: "test2@test.com", role: "user", pwd: "pass", avatar: ""}
  ];
  }

  getGroups(): any {
    return ;
  }

  getChannels(): any {
    return ;
  }

  getGroupMember(): any {
    return [{username:"userfour", gid:"g1"}];
  }

  getChannelMember(): any {
    return ;
  }

  // POST functions

  // postUser(item:any): any {
  //   this.httpClient.post<User>(BACKEND_URL + '/admin/users', item, httpOptions)
  // }

  // postGroup(item:object): any {
  //   return this.httpClient.post<Group>(BACKEND_URL + '/group', item, httpOptions);
  // }
  // postChannel(item:object): any {
  //   return this.httpClient.post<Channel>(BACKEND_URL + '/channel', item, httpOptions);
  // }

  // postGroupMember(item:object): any {
  //   return this.httpClient.post<User>(BACKEND_URL + '/member/group', item, httpOptions);
  // }

  // postChannelMember(item:object): any {
  //   return this.httpClient.post<User>(BACKEND_URL + '/member/channel', item, httpOptions);
  // }

  // // PUT functions

  // putUser(item:object): any {
  //   return this.httpClient.put<User>(BACKEND_URL + '/admin/users', item,  httpOptions)
  // }

  // // DELETE functions

  // deleteUser(id:string): any {
  //   return this.httpClient.delete(BACKEND_URL + '/admin/users/' + id + '/-', httpOptions);
  // }

  // deleteAllUsers(id:string): any {
  //   this.httpClient.delete(BACKEND_URL + '/admin/users/all/' + id, httpOptions)
  // }

  // deleteGroup(id:string): any {
  //   return this.httpClient.delete(BACKEND_URL + '/group/' + id, httpOptions);
  // }

  // deleteChannel(id:string): any {
  //   return this.httpClient.delete(BACKEND_URL + '/channel/' + id, httpOptions);
  // }

  // deleteGroupMember(user:string, gid:string): any {
  //   return this.httpClient.delete(BACKEND_URL + '/member/group/' + user + '/' + gid, httpOptions)
  // }

  // deleteChannelMember(user:string, cid:string): any {
  //   return this.httpClient.delete(BACKEND_URL + '/member/channel/' + user + '/' + cid, httpOptions);
  // }
}
