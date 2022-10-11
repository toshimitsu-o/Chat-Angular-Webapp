import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Router, HttpClient ]
    });
    service = TestBed.inject(AuthService);
  });

  //service = TestBed.get(AuthService);

  it('should be created', () => {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };
    expect(service).toBeTruthy();
  });

  it('should get session', () => {
    let user = {username: "test", email: "test@test.com", role: "user", pwd: "pass", avatar: ""};
    expect(service.saveSession(user)).toBeTruthy();
  });

});
