import { Injectable } from '@angular/core';
import {map, Observer} from "rxjs";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Member} from "./member.service";

export const JWT_TOKEN = 'JWT_TOKEN';
export const USERNAME = 'USERNAME';
export const USER_ID = 'USER_ID';

export const AuthedHttpHeader = () => {
  return new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem(JWT_TOKEN)
  })
}

type LoginResult = {
  token: string;
  _id: string;
  username: string;
}

export const SERVER_URL = 'http://localhost:4000';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Member | undefined;
  constructor(private httpClient: HttpClient) {
    this.refreshRoles();
  }

  refreshRoles() {
    this.httpClient.get<Member>(SERVER_URL + '/api/users/profile', {
      headers: AuthedHttpHeader()
    })
      .subscribe(user => {
        this.user = user;
      })
  }

  checkAuth(): Boolean {
     return Boolean(localStorage.getItem(JWT_TOKEN));
  }

  saveUserId(user_id: string) {
    localStorage.setItem(USER_ID, user_id);
  }

  getUserId(): string {
    return localStorage.getItem(USER_ID) || '';
  }

  saveToken(token: string) {
    localStorage.setItem(JWT_TOKEN, token);
  }

  removeToken() {
    localStorage.removeItem(JWT_TOKEN);
  }

  login(email: string, password: string) {
    return this.httpClient.post<LoginResult>(SERVER_URL + '/api/users/signin', {
      email,
      password
    });
  }

  register(email: string, username: string, password: string) {
    return this.httpClient.post(SERVER_URL + `/api/users/signup`, {
      email,
      username,
      password
    })
  }

}
