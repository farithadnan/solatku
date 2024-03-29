import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopNavbarComponent } from "./shared/menu/top-navbar/top-navbar.component";

import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { TuiRootModule, TuiDialogModule, TuiButtonModule, TUI_SANITIZER } from "@taiga-ui/core";
import { TuiIslandModule } from '@taiga-ui/kit';
import { TuiNavigationModule } from "@taiga-ui/experimental";
import { PrayerTimeBaseComponent } from './pages/prayer-time-base/prayer-time-base.component';
import { NextPrayerInfoComponent } from './pages/prayer-time-base/next-prayer-info/next-prayer-info.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';

const TUI_MODULES = [
  TuiRootModule,
  TuiDialogModule,
  TuiButtonModule,
  TuiNavigationModule,
  TuiIslandModule,
];

@NgModule({
  declarations: [
    AppComponent,
    TopNavbarComponent,
    PrayerTimeBaseComponent,
    NextPrayerInfoComponent,
  ],
  imports: [
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
  providers: [{provide: TUI_SANITIZER, useClass: NgDompurifySanitizer}],
  bootstrap: [AppComponent]
})
export class AppModule { }
