import { Injectable } from '@angular/core';
import {map, Observer} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";

export const JWT_TOKEN = 'JWT_TOKEN';

type LoginResult = {
  token: string;
}

export const SERVER_URL = 'http://localhost:4000';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  checkAuth(): Boolean {
     return Boolean(localStorage.getItem(JWT_TOKEN));
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
