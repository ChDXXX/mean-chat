import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService, SERVER_URL} from "./auth.service";
import {forkJoin} from "rxjs";
import {Channel} from "./contact.service";

export enum UserRole {
  SUPER_ADMIN = 40,
  GROUP_ADMIN = 30,
  GROUP_ASSISTANT =20,
  GENERAL_USER = 10
}

export interface Role {
  role: UserRole,
  group?: string;
  channel?: string;
}

export interface Member {
  _id: string;
  username: string;
  creator: string;
  email: string;
  roles: Role[];
  isCreator?: Boolean;
  isAdmin?: Boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  members: Member[] = [];
  currentChannel: Channel | undefined;
  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  refreshMembers(channel: Channel) {
    this.currentChannel = channel;
    const getMembers = channel.users.map(id => {
      return this.httpClient.get<Member>(SERVER_URL + `/api/users/${id}`);
    });
    forkJoin(getMembers)
      .subscribe(members => {
        this.members = members.map(member => {
          member.isAdmin = channel.admins.includes(member._id);
          member.isCreator = channel.creator === member._id;
          return member;
        });
      })
  }
}
