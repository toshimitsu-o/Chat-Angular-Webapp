import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};
import { AuthService } from '../services/auth.service'; // To get/save session

const BACKEND_URL = "http://localhost:3000";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[AuthService]
})
export class LoginComponent implements OnInit {
  email:string = "";
  password:string = "";

  constructor(private router: Router, private httpClient: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
  }

  // Check login details connecting auth server
  login() {
    this.authService.login(this.email, this.password);
  }
}
