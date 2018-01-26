import { Component } from '@angular/core';
import { AppAnimation } from './app.animation';
import { Title } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { FileUploader } from 'ng2-file-upload';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { NavigationStart, Router } from '@angular/router';
import { numberToWords } from 'number-to-words';
import { testedCameras } from './tested-cameras';

enum InfoCardContent {
  Closed = 0,
  ExifData = 1,
  CameraInfo = 2,
  About = 3
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: AppAnimation
})
export class AppComponent {
  public uploader: FileUploader;
  public fileName = '';
  public isFileOverDropZone = false;
  public isFileOverPage = false;
  public response = '';
  public InfoCardContent = InfoCardContent;     // import enum
  public testedCameras = testedCameras;         // import testedCameras
  public selectedBrand = testedCameras.brands[0].name;  // selected brand on tested cameras page
  public infoCardState = this.InfoCardContent.Closed;
  public showExif = false;
  public exifData = {};
  public shutterCount = 0;
  public shutterCountWords = '';

  constructor(private router: Router,
              private titleService: Title,
              private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {

    // Handle Routes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.url === '/about') {
          this.toggleInfoCard(InfoCardContent.About);
        } else if (event.url === '/supported-cameras') {
          this.toggleInfoCard(InfoCardContent.CameraInfo);
        } else if (event.url === '/exif-info') {
          this.toggleInfoCard(InfoCardContent.ExifData);
        } else {
          this.toggleInfoCard(InfoCardContent.Closed);
        }
      }
    });

    this.titleService.setTitle('Shutter.cc 📷 - Shutter Count / EXIF');

    this.uploader = new FileUploader({
      url: environment.apiURL + '/upload',
      disableMultipart: false
    });

    this.uploader.response.subscribe(res => this.response = res);
    console.log(testedCameras);
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

    if (this.uploader.queue) {
      this.uploader.queue[0].upload();
      this.fileName = this.uploader.queue[0]._file.name;
    }

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) =>  {
      response = JSON.parse(response);
      delete response.exif[ 'SourceFile' ];
      delete response.exif[ 'errors' ];
      delete response.exif[ 'ExifToolVersion' ];
      delete response.exif[ 'FileName' ];
      delete response.exif[ 'Directory' ];
      delete response.exif[ 'ExifToolVersion' ];

      this.exifData = response.exif;

      // Clear uploader queue
      this.uploader.clearQueue();

      console.log(this.exifData);

      // TODO Check for valid exif
      if (this.exifData['Make'] === 'SONY') {
        if (this.exifData['ImageCount']) {
          this.shutterCount = parseInt(this.exifData['ImageCount'], 10);
        } else if (this.exifData['ImageCount2']) {
          this.shutterCount = parseInt(this.exifData['ImageCount2'], 10);
        }
      } else if (this.exifData['Make'] === 'NIKON CORPORATION') {
        if (this.exifData['ShutterCount']) {
          this.shutterCount = parseInt(this.exifData['ShutterCount'], 10);
        }
      } else if (this.exifData['Make'] === 'RICOH IMAGING COMPANY, LTD.') {
        if (this.exifData['ShutterCount']) {
          this.shutterCount = parseInt(this.exifData['ShutterCount'], 10);
        }
      }

      this.shutterCount ? this.shutterCountWords = numberToWords.toWords(this.shutterCount).toUpperCase() : this.shutterCountWords = '';

      // Format Date/Time
      Object.keys(this.exifData).forEach((key) => {
        if (this.exifData[key] && this.exifData[key]['year']) {
          console.log('got date: ' + JSON.stringify(this.exifData[key]));
        }
      });

      console.log(`Make: ${this.exifData['Make']}, Camera: ${this.exifData['Model']}, ShutterCount: ${this.shutterCount}`);

      // this.toggleInfoCard(InfoCardContent.ExifData);
      this.router.navigate(['exif-info']);
    };

    this.uploader.uploadAll();
  }

  public toggleInfoCard(content: InfoCardContent) {
    // Reset data on info card closing
    if (content === InfoCardContent.Closed) {
      this.response = '';
      this.showExif = false;
      this.exifData = {};
      this.shutterCount = 0;
      this.shutterCountWords = '';
    }

    this.infoCardState = content;
  }

  public formatedExifList(exif: Object) {
    let returnStr = '';

    Object.keys(exif).forEach(function(key) {
      returnStr += '<div>';
      returnStr += '<li class="exif-key">';
      returnStr += key.toString();
      returnStr += '</li>';
      returnStr += '<li class="exif-val">';
      returnStr += exif[key].toString();
      returnStr += '</li>';
      returnStr += '</div>';
    });

    return returnStr;
  }

}
