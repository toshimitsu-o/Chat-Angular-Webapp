import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth.service'; // To get/save session
import { AuthServiceMock } from '../mocks/auth.service.mock';
import {HttpClient} from '@angular/common/http';
import { DatabaseService } from '../services/database.service';
import { DatabaseServiceMock } from '../mocks/database.service.mock';
import { ImguploadService } from '../services/imgupload.service';

import { SidenavComponent } from './sidenav.component';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidenavComponent ],
      providers: [{provide: AuthService, useClass: AuthServiceMock}, HttpClient, ImguploadService, {provide: DatabaseService, useClass: DatabaseServiceMock}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should get groups', () => {
    expect(component.getGroupMember()).toBeTruthy();
  });
});
