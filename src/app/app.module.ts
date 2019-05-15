import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FileUploadModule } from 'ng2-file-upload';
import { MomentModule } from 'angular2-moment';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

import { AppComponent } from './app.component';

const ROUTES: Routes = [
  { path: '',       component: AppComponent },
  { path: 'about',  component: AppComponent },
  { path: 'supported-cameras',  component: AppComponent },
  { path: 'exif-info',  component: AppComponent }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES, { enableTracing: true }),
    Angulartics2Module.forRoot(),
    FileUploadModule,
    MomentModule
  ],
  providers: [
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
