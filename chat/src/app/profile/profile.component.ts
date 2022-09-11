import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // To get/save session

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers:[AuthService]
})
export class ProfileComponent implements OnInit {

  user: any;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.getSession(); // get user session data
  }

  save() {
    // Save to session storage
    this.authService.userUpdate(this.user);
  }

}
