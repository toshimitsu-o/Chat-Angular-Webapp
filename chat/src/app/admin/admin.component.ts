import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  user: any;
  groups = [{id: "g1", name:"Group 1"}, {id: "g2", name:"Group 2"}, {id: "g3", name:"Group 3"}];
  channels = [{id: "c1", name:"Channel 1", gid: "g1"}, {id: "c2", name:"Channel 2", gid: "g1"}, {id: "c3", name:"Channel 3",  gid: "g2"}];
  resultChannels: any[] = [];
  groupMembers = [{username: "user1", gid: "g1"}, {username: "user2", gid: "g2"}, {username: "user3", gid: "g3"}];
  resultGroupMembers: any[] = [];
  selectedGroup = "";
  public isCollapsed = true;
  public isCollapsedC = true;

  constructor(private authService: AuthService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.user = this.authService.getSession(); // get user session data
  }

  createGroup(id: string, name: string): void {
    if (this.groups.find(g => g.id == id)) { // Check if already exist
      alert("ID already taken!");
    } else {
      this.groups.push({id: id, name: name});
    }
  }

  createChannel(id: string, name: string): void {
    if (this.channels.find(g => g.id == id)) { // Check if already exist
      alert("ID already taken!");
    } else {
      this.channels.push({id: id, name: name, gid: this.selectedGroup});
    }
  }

  removeGroup(id: string): void {
    this.groups = this.groups.filter(g => g.id != id)
  }

  showChannels(content: any, id: string): void {
    this.selectedGroup = id;
    this.modalService.open(content, { size: 'lg' });
  }

  showUsers(content: any, id: string): void {
    this.resultGroupMembers = this.groupMembers.filter(g => g.gid == id);
    this.modalService.open(content, { size: 'lg' });
  }

  removeChannel(id: string): void {
    this.channels = this.channels.filter(c => c.id != id)
  }

}
