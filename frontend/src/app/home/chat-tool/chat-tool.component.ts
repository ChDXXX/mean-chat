import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SocketioService} from "../../socketio.service";
import {MemberService} from "../../member.service";
import {MatDialog} from "@angular/material/dialog";
import {MediaDashboardComponent} from "./media-dashboard/media-dashboard.component";

@Component({
  selector: 'app-chat-tool',
  templateUrl: './chat-tool.component.html',
  styleUrls: ['./chat-tool.component.css']
})
export class ChatToolComponent implements OnInit {

  form = {
    message: ''
  }
  formGroup = new FormGroup({
    message: new FormControl('', [
      Validators.required
    ])
  })

  get message() {
    return this.formGroup.get('message');
  }

  constructor(
    private socketService: SocketioService,
    private memberService: MemberService,
    private mediaDashboard: MatDialog
  ) { }

  ngOnInit(): void {
  }

  handleOpenMediaDashboard(type: 'video' | 'image') {
    const mediaDashboardRef = this.mediaDashboard.open(MediaDashboardComponent, {
      data: {
        mediaType: type
      },
      width: '800px'
    });
    mediaDashboardRef.componentInstance.onSend.subscribe(({file, type}) => {
      this.socketService
        .uploadFile(file)
        .subscribe((source) => {
          if (type === 'image') {
            this.socketService.sendImageMessage(source.filename);
          }
          if (type === 'video') {
            this.socketService.sendVideoMessage(source.filename);
          }
        })
      mediaDashboardRef.close();
    })
  }

  handleSendTextMessage() {
    if (this.memberService.currentChannel) {
      this.socketService.sendTextMessage(this.memberService.currentChannel, this.form.message);
      this.message?.reset('');
    }
  }

}
