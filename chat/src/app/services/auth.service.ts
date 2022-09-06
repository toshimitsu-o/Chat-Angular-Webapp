import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Ability, AbilityBuilder } from '@casl/ability';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

const BACKEND_URL = "http://localhost:3000";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private httpClient: HttpClient, private ability: Ability) { }

  // Check login details connecting auth server
  public login(email: string, password: string) {
    let userpwd = {email: email, upwd: password}
    this.httpClient.post(BACKEND_URL + '/api/auth', userpwd, httpOptions)
    .subscribe((data: any) => {
      if (data.valid) { // if received valid in data is true
        this.updateAbility(data); // Update Aility
        this.saveSession(data); // save data to session
        // Navigate to profile page
        this.router.navigate(['/profile']);
      } else {
        alert("Login failed.");
      }
    });
  }

  // Update Ability with user data
  private updateAbility(user: any) {
    const { can, rules} = new AbilityBuilder(Ability);

    if (user.role === 'superAdmin') {
      can('manage', 'all');
    } else {
      can('read', 'all');
    }
    this.ability.update(rules);
  }

  // Read from session storage
  getSession() {
    if (!sessionStorage.getItem("user")) {
      // no valid session relocate to login page
      alert("Not logged in!");
      this.router.navigate(['/login']);
      return null;
    } else {
      return JSON.parse(sessionStorage.getItem("user") || "");
    }
  }
  // Save to session storage
  saveSession(data: any) {
    sessionStorage.setItem("user", JSON.stringify(data));
  }

  // Clear session to Logout
  logout() {
    sessionStorage.clear();
    this.updateAbility([]); // Empty Ability
    this.router.navigate(['/login']);
  }
}
