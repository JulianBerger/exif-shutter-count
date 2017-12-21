import {AfterViewChecked, Component} from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

import { FileUploader } from 'ng2-file-upload';

enum InfoCardContent {
  Closed = 0,
  ExifData = 1,
  CameraInfo = 2,
  About = 3
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    trigger('reveal-up', [
      transition('* => true', [
        animate(600, style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      state('false',
        style({ transform: 'translateY(100vh)', opacity: 0 })
      )
    ]),
    trigger('reveal-up-2', [
      transition('* => true', [
        animate(600, style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      state('false',
        style({ transform: 'translateY(200vh)', opacity: 0 })
      )
    ]),
    trigger('card-show', [
      transition('* => true', [
        animate(666, style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition('true => false', [
        animate(333, style({ transform: 'translateY(300vh)', opacity: 0 }))
      ]),
      state('false',
        style({ transform: 'translateY(300vh)', opacity: 0 })
      )
    ])
  ]
})
export class AppComponent implements AfterViewChecked {
  public uploadURL = 'http://localhost:8080/api/upload';
  public uploader: FileUploader;
  public isFileOverDropZone = false;
  public isFileOverPage = false;
  public response = '';
  public InfoCardContent = InfoCardContent;    // import enum
  public infoCardState = this.InfoCardContent.Closed;
  public showExif = false;
  public exifData = {};
  public shutterCount = 0;
  public pageLoaded = false;

  constructor() {
    this.uploader = new FileUploader({
      url: this.uploadURL,
      disableMultipart: false
    });

    this.uploader.response.subscribe(res => this.response = res);
  }

  ngAfterViewChecked() {
      this.pageLoaded = true;
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

      // Format Date/Time
      Object.keys(this.exifData).forEach((key) => {
        if (this.exifData[key]['year']) {
          console.log('got date: ' + JSON.stringify(this.exifData[key]));
        }
      });

      console.log(`Make: ${this.exifData['Make']}, Camera: ${this.exifData['Model']}, ShutterCount: ${this.shutterCount}`);

      this.toggleInfoCard(InfoCardContent.ExifData);
    };

    this.uploader.uploadAll();
  }

  public toggleInfoCard(content: InfoCardContent) {
    this.infoCardState = content;
  }

  public toWords(s: any) {
    const th = ['','thousand','million', 'billion','trillion'];
    const dg = ['zero','one','two','three','four', 'five','six','seven','eight','nine'];
    const tn = ['ten','eleven','twelve','thirteen', 'fourteen','fifteen','sixteen', 'seventeen','eighteen','nineteen'];
    const tw = ['twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

    s = s.toString();
    s = s.replace(/[\, ]/g, '');
    if (s != parseFloat(s)) return 'not a number';
    let x = s.indexOf('.');
    if (x == -1) x = s.length;
    if (x > 15) return 'too big';
    let n = s.split('');
    let str = '';
    let sk = 0;
    for (var i = 0; i < x; i++) {
      if ((x - i) % 3 == 2) {
        if (n[i] == '1') {
          str += tn[Number(n[i + 1])] + ' ';
          i++;
          sk = 1;
        }
        else if (n[i] != 0) {
          str += tw[n[i] - 2] + ' ';
          sk = 1;
        }
      }
      else if (n[i] != 0) {
        str += dg[n[i]] + ' ';
        if ((x - i) % 3 == 0) str += 'hundred ';
        sk = 1;
      }


      if ((x - i) % 3 == 1) {
        if (sk) str += th[(x - i - 1) / 3] + ' ';
        sk = 0;
      }
    }
    if (x != s.length) {
      let y = s.length;
      str += 'point ';
      for (let i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
    }
    return str.replace(/\s+/g, ' ').toUpperCase();
  }

  public formatedExifList(exif: Object) {
    let returnStr = '';

    Object.keys(exif).forEach(function(key) {
      returnStr += '<div>';
      returnStr += '<li class="exif-key">';
      returnStr += key.toString();
      returnStr += '</li>';
      returnStr += '<li class="exif-val">';
      returnStr += JSON.stringify(exif[key]).toString();
      returnStr += '</li>';
      returnStr += '</div>';
    });

    return returnStr;
  }

}
