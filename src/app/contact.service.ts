import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthedHttpHeader, SERVER_URL} from "./auth.service";

export interface Channel {
  _id: string;
  name: string;
  admins: string[];
  users: string[];
  group: string;
  creator: string;
  createdTime: string;
}

export interface Group {
  _id: string;
  name: string;
  creator: string;
  channels: Channel[];
  createdTime: string;
  open?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Group[] = [];
  openedGroups: string[] = [];
  constructor(private httpClient: HttpClient) { }

  closeGroup(group: string) {
    this.openedGroups = this.openedGroups.filter(item => item !== group);
  }

  openGroup(group: string) {
    this.openedGroups.push(group);
  }

  createGroup(name: string) {
    return this.httpClient.post(SERVER_URL + '/api/groups', {
      group_name: name
    }, {
      headers: AuthedHttpHeader()
    })
  }

  deleteGroup(group_id: string) {
    return this.httpClient.delete(SERVER_URL + '/api/groups/' + group_id);
  }

  createChannel(name: string, group: string) {
    return this.httpClient.post(SERVER_URL + '/api/channels', {
      name,
      group
    }, {
      headers: AuthedHttpHeader()
    })
  }

  deleteChannel(channel_id: string) {
    return this.httpClient.delete(SERVER_URL + '/api/channels/' + channel_id);
  }

  fetchContacts() {
    this.getUserContacts()
      .subscribe(contacts => {
        this.contacts = contacts;
      })
  }

  getUserContacts(): Observable<Group[]> {
    return this.httpClient.get<Group[]>(SERVER_URL + '/api/groups', {
      headers: AuthedHttpHeader()
    })
  }
}
