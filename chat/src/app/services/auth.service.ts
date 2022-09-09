import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: any = "";

  constructor(private router: Router) { }

  // Read from session storage
  getSession() {
    if (!sessionStorage.getItem("user")) {
      // no valid session relocate to login page
      alert("Not logged in!");
      this.router.navigate(['/login']);
    } else {
      this.user = JSON.parse(sessionStorage.getItem("user") || "");
    }
    return this.user;
  }

  // Save to session storage
  saveSession(data: any) {
    this.user = JSON.stringify(data);
    sessionStorage.setItem("user", this.user);
  }

  // Clear session to Logout
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
