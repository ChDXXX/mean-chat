import { Injectable } from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {J} from "@angular/cdk/keycodes";
import {Channel} from "./contact.service";
import {HttpClient} from "@angular/common/http";
import {SERVER_URL} from "./auth.service";
enum MessageTypes {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}
export interface Message {
  messageType: MessageTypes;
  resourcePath: string;
  message: string;
  author: string;
  createdTime: string;
}

export const environment = {
  SOCKET_ENDPOINT: 'http://localhost:4000'
}


export const SOCKET_MESSAGES = {
  SAVE_TOKEN: 'SAVE_TOKEN',
  SWITCH_CHANNEL: 'SWITCH_CHANNEL',
  GET_MESSAGES: 'GET_MESSAGES',
  GET_MESSAGES_RES: 'GET_MESSAGES_RES',
  POST_MESSAGE: 'POST_MESSAGE',
  POST_IMAGE: 'POST_IMAGE',
  POST_VIDEO: 'POST_VIDEO'
}

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket: Socket | undefined;
  messages: Message[] = [];
  constructor(private httpClient: HttpClient) { }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<{filename: string}>(SERVER_URL + '/upload', formData);
  }

  sendImageMessage(filename: string) {
    this.socket?.emit(SOCKET_MESSAGES.POST_MESSAGE, JSON.stringify({
      messageType: MessageTypes.IMAGE,
      resourcePath: filename
    }))
  }

  sendTextMessage(channel: Channel, message: string) {
    this.socket?.emit(SOCKET_MESSAGES.POST_MESSAGE, JSON.stringify({
      messageType: MessageTypes.TEXT,
      message: message,
    }));
  }

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.socket.on(SOCKET_MESSAGES.GET_MESSAGES_RES, (messagesJsonStr) => {
      const messages = JSON.parse(messagesJsonStr);
      console.log(messages)
      this.messages = messages;
    })
  }

  switchChannel(channel_id: string) {
    this.socket?.emit(SOCKET_MESSAGES.SWITCH_CHANNEL, channel_id);
  }
}
