import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {MemberService} from "../member.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    public memberService: MemberService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  handleSignOut() {
    this.authService.removeToken();
    window.location.reload();
  }
}
