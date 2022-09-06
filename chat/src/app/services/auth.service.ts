import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  // Read from session storage
  getSession() {
    if (!sessionStorage.getItem("user")) {
      // no valid session relocate to login page
      alert("Not logged in!");
      this.router.navigate(['/login']);
      return null;
    } else {
      let data = JSON.parse(sessionStorage.getItem("user") || "");
      return new User(data.username, data.email, data.role, data.valid);
    }
  }
  // Save to session storage
  saveSession(user: User) {
    sessionStorage.setItem("user", JSON.stringify(user));
  }

  // Clear session to Logout
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
