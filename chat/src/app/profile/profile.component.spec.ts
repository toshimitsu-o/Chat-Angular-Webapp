import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth.service'; // To get/save session
import { AuthServiceMock } from '../mocks/auth.service.mock';

import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      providers: [ {provide: AuthService, useClass: AuthServiceMock}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should save session storage', () => {
    let user = {username: "test", email: "test@test.com", role: "user", pwd: "pass", avatar: ""}
    expect(component.save(user)).toBeTruthy();
  });
});
