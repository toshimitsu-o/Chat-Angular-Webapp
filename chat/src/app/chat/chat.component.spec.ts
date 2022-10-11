import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocketService } from '../services/socket.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ImguploadService } from '../services/imgupload.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../services/toast.service';
import { DatabaseService } from '../services/database.service';
import { DatabaseServiceMock } from '../mocks/database.service.mock';

import { ChatComponent } from './chat.component';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatComponent ],
      imports: [],
      providers: [ SocketService, ActivatedRoute, Router, AuthService, ImguploadService, NgbModal, ToastService,
        {provide: DatabaseService, useClass: DatabaseServiceMock}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should get messages', () => {
    expect(component.getMessages("c1")).toBeTruthy();
  });
});
