import { Injectable } from '@angular/core';
import {io, Socket} from 'socket.io-client';


export const environment = {
  SOCKET_ENDPOINT: 'http://localhost:4000'
}

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket: Socket | undefined;
  constructor() { }

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);
  }
}
