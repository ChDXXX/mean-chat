import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthedHttpHeader, AuthService, SERVER_URL} from "./auth.service";
import {forkJoin, Observable} from "rxjs";
import {Channel, Group} from "./contact.service";

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
  currentGroup: Group | undefined;
  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  get isChannelAdmin() {
    if (this.currentGroup?.creator === this.authService.getUserId()) {
      return true;
    }
    if (this.currentChannel?.admins.includes(this.authService.getUserId())) {
      return true;
    }
    return false;
  }

  createMember(username: string, email: string, password: string) {
    return this.httpClient.post(SERVER_URL + `/api/channels/${this.currentChannel?._id}/create-user`, {
      username,
      email,
      password
    }, {
      headers: AuthedHttpHeader()
    })

  }

  upgradeToSuperAdmin(user_id: string) {
    return this.httpClient.put(SERVER_URL + `/api/superadmins/${user_id}`, {});
  }

  upgradeToGroupAdmin(user_id: string) {
    return this.httpClient.put(SERVER_URL + `/api/groupadmins/${user_id}`, {})
  }

  upgradeToChannelAdmin(channel_id: string, user_id: string) {
    return this.httpClient.put(SERVER_URL + `/api/channels/${channel_id}/upgrade`, {
      user_id
    })
  }

  refresh() {
    if (this.currentChannel) {
      this.refreshMembers(this.currentChannel);
    }
  }

  removeMember(member_id: string) {
    return this.httpClient.delete(SERVER_URL + `/api/channels/${this.currentChannel?._id}/remove/${member_id}`)
  }

  refreshMembers(channel: Channel) {
    this.currentChannel = channel;
    if (this.currentChannel) {
      this.httpClient.get<Member[]>(SERVER_URL + `/api/channels/${this.currentChannel._id}/users`)
        .subscribe(members => {
          this.members = members.map(member => {
            member.isAdmin = channel.admins.includes(member._id);
            member.isCreator = channel.creator === member._id;
            return member;
          });
        })
    }

  }
}
