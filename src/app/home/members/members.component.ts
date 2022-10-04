import { Component, OnInit } from '@angular/core';
import {MemberService} from "../../member.service";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {

  constructor(public memberService: MemberService, public authService: AuthService) { }

  ngOnInit(): void {
  }

}
