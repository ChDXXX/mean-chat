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
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private httpClient: HttpClient) { }

  getUserContacts(): Observable<Group[]> {
    return this.httpClient.get<Group[]>(SERVER_URL + '/api/groups', {
      headers: AuthedHttpHeader()
    })
  }
}
