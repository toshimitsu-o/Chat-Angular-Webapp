import { Component } from '@angular/core';
import { AuthService } from './services/auth.service'; // To get/save session
import { Router } from '@angular/router';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[AuthService, DatabaseService]
})
export class AppComponent {
  title = 'chat';
  showSidenav = true;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

  }
  ngDoCheck(): void {
    if (window.location.pathname == '/login') {
      this.showSidenav = false;
    } else {
      this.showSidenav = true;
    }
  }

}
