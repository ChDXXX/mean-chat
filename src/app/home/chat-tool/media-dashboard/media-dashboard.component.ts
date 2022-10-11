import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";


export interface MediaDashboardData {
  mediaType: 'image' | 'video'
}

@Component({
  selector: 'app-media-dashboard',
  templateUrl: './media-dashboard.component.html',
  styleUrls: ['./media-dashboard.component.css']
})
export class MediaDashboardComponent implements OnInit {
  @Output() onSend = new EventEmitter<{file: File, type: 'image' | 'video'}>();
  file: File | undefined;
  image: string = '';
  video: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MediaDashboardData
  ) { }

  ngOnInit(): void {
  }

  handleSend() {
    this.onSend.emit({
      file: this.file as File,
      type: this.data.mediaType
    });
  }

  handleSelectVideo(e: any) {
    const videoFile = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(videoFile);
    reader.onload = () => {
      this.video = reader.result as string;
    }
  }

  handleSelectImage(e: any) {
    const imageFile = e.target.files[0];
    this.file = imageFile;
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = () => {
      this.image = reader.result as string;
    }
  }

}
