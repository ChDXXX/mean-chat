import { Component, OnInit } from '@angular/core';
import {AuthService, JWT_TOKEN} from "../auth.service";
import {Router} from "@angular/router";
import {MemberService} from "../member.service";
import { SOCKET_MESSAGES, SocketioService} from "../socketio.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    public memberService: MemberService,
    private authService: AuthService,
    private router: Router,
    private socketService: SocketioService
  ) { }

  ngOnInit(): void {
    this.socketService.setupSocketConnection();
    this.socketService.socket?.emit(SOCKET_MESSAGES.SAVE_TOKEN, localStorage.getItem(JWT_TOKEN));
  }

  handleSignOut() {
    this.authService.removeToken();
    window.location.reload();
  }
}
