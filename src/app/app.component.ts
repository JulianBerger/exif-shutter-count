import { Component } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

enum InfoCardContent {
  Closed = 0,
  CameraInfo = 1,
  About = 2
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public uploadURL = 'https://localhost:8080/api/upload';
  public uploader: FileUploader;
  public isFileOverDropZone = false;
  public isFileOverPage = false;
  public response = '';
  public InfoCardContent = InfoCardContent;    // import enum
  public infoCardState = this.InfoCardContent.Closed;

  constructor() {
    this.uploader = new FileUploader({
      url: this.uploadURL,
      disableMultipart: false
    });

    this.uploader.response.subscribe(res => this.response = res);
  }

  public fileOverUploader(e: any): void {
    if (this.uploader.isUploading) {
      this.isFileOverDropZone = false;
      return;
    }
    this.isFileOverDropZone = e;
  }

  public fileOverPage(e: any): void {
    if (this.uploader.isUploading) {
      this.isFileOverPage = false;
      return;
    }
    this.isFileOverPage = e;
  }

  public fileDropped(e: any): void {
    if (this.uploader.isUploading) {
      return;
    }
    // TODO: Check file Type & Size
    this.uploader.uploadAll();
    this.toggleInfoCard(InfoCardContent.CameraInfo);
  }

  public toggleInfoCard(content: InfoCardContent) {
    this.infoCardState = content;
    //this.infoCardOpened = open;
  }

}
