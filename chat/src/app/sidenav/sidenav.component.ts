import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // To get/save session

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  user: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.getSession(); // get user session data
  }

  ngDoCheck(): void {
    //this.user = this.authService.getSession(); // get user session data
  }

  // Logout and clear session
  logout() {
    this.authService.logout(); // Logout via service
  }
}
