import {Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {SocketioService} from "../../socketio.service";
import {SERVER_URL} from "../../auth.service";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit{
  SERVER_URL = SERVER_URL;
  constructor(public socketService: SocketioService) { }

  get messages() {
    return this.socketService.messages;
  }


  ngOnInit(): void {
    setTimeout(() => {
      this.socketService.scrollToBottom();
    }, 1000);
  }

}
