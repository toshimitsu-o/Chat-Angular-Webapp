import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};
import { AuthService } from '../services/auth.service'; // To get/save session

const BACKEND_URL = "https://s5251464.elf.ict.griffith.edu.au:3000";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[AuthService]
})
export class LoginComponent implements OnInit {
  username:string = "";
  password:string = "";

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  submitted = false;

  constructor(private router: Router, private httpClient: HttpClient, private authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required
          ]
        ],
        password: [
          '',
          [
            Validators.required
          ]
        ]
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    this.login();

  }

  // Check login details connecting auth server
  public login() {
    let user = {username:this.username, pwd: this.password};
    this.httpClient.post(BACKEND_URL + '/auth/login', user, httpOptions)
    .subscribe((data: any) => {
      if (data.valid) { // if received valid in data is true
        this.authService.saveSession(data); // save data to session
        // Relocate
        this.router.navigate(['video']);
      } else {
        alert("Login failed.");
      }
    });
  }
}
