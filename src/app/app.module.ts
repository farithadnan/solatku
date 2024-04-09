import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopNavbarComponent } from "./shared/menu/top-navbar/top-navbar.component";

import { ToastrModule } from 'ngx-toastr';
import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { TuiRootModule, TuiDialogModule, TuiButtonModule, TUI_SANITIZER, TuiNotificationModule } from "@taiga-ui/core";
import { TuiIslandModule } from '@taiga-ui/kit';
import { TuiNavigationModule, TuiIconModule } from "@taiga-ui/experimental";
import { PrayerTimeBaseComponent } from './pages/prayer-time-base/prayer-time-base.component';
import { NextPrayerInfoComponent } from './pages/prayer-time-base/next-prayer-info/next-prayer-info.component';

import { EpochToDatePipe } from './shared/pipes/epoch-to-date.pipe';
import { CountdownPipe } from './shared/pipes/countdown.pipe';
import { NotificationComponent } from './shared/notification/notification.component';
import { PrayerTimeTableComponent } from './pages/prayer-time-base/prayer-time-table/prayer-time-table.component';

const TUI_MODULES = [
  TuiRootModule,
  TuiDialogModule,
  TuiButtonModule,
  TuiNavigationModule,
  TuiIslandModule,
  TuiNotificationModule,
  TuiIconModule,
];

@NgModule({
  declarations: [
    AppComponent,
    TopNavbarComponent,
    PrayerTimeBaseComponent,
    NextPrayerInfoComponent,
    PrayerTimeTableComponent,
    NotificationComponent,
    EpochToDatePipe,
    CountdownPipe,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TUI_MODULES,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
],
  providers: [
      {provide: TUI_SANITIZER, useClass: NgDompurifySanitizer},
      DatePipe,
      CountdownPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
