import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopNavbarComponent } from "./shared/menu/top-navbar/top-navbar.component";

import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { TuiRootModule, TuiDialogModule, TUI_SANITIZER } from "@taiga-ui/core";
import { TuiNavigationModule } from "@taiga-ui/experimental";
import { PrayerTimeBaseComponent } from './pages/prayer-time-base/prayer-time-base.component';

const TUI_MODULES = [
  TuiRootModule,
  TuiDialogModule,
  TuiNavigationModule,
];

@NgModule({
  declarations: [
    AppComponent,
    TopNavbarComponent,
    PrayerTimeBaseComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TUI_MODULES,
],
  providers: [{provide: TUI_SANITIZER, useClass: NgDompurifySanitizer}],
  bootstrap: [AppComponent]
})
export class AppModule { }
