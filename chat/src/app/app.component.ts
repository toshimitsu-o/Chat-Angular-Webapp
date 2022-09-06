import { Component } from '@angular/core';
import { AuthService } from './services/auth.service'; // To get/save session

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[AuthService]
})
export class AppComponent {
  title = 'chat';

  constructor(private authService: AuthService) { }

  // Logout and clear session
  logout() {
    this.authService.logout(); // Logout via service
  }
}
