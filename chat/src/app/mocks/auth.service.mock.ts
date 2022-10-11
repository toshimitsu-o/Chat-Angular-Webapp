import { Injectable } from '@angular/core';

export class AuthServiceMock {

  user: any = "";

  constructor() { }

  // Read from session storage
  getSession() {
    return {username: "test", email: "test@test.com", role: "user", pwd: "pass", avatar: ""};
  }

  // Save to session storage
  saveSession(data: any) {
    
  }
  

  // Update user info
  userUpdate(user: any){
    
  }

  // Clear session to Logout
  logout() {
    
  }
}
