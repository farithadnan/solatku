import { of } from 'rxjs';
import { NgModule, isDevMode } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopNavbarComponent } from "./shared/menu/top-navbar/top-navbar.component";
import { PrayerTimeBaseComponent } from './pages/prayer-time-base/prayer-time-base.component';
import { NextPrayerInfoComponent } from './pages/prayer-time-base/next-prayer-info/next-prayer-info.component';
import { NotificationComponent } from './shared/notification/notification.component';
import { PrayerTimeTableComponent } from './pages/prayer-time-base/prayer-time-table/prayer-time-table.component';
import { ZoneSwitcherComponent } from './shared/dialogs/zone-switcher/zone-switcher.component';
import { EpochToDatePipe } from './shared/pipes/epoch-to-date.pipe';
import { CountdownPipe } from './shared/pipes/countdown.pipe';

import { ToastrModule } from 'ngx-toastr';
import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { TuiRootModule, TuiDialogModule, TuiButtonModule, TUI_SANITIZER,
         TuiNotificationModule, TuiSvgModule, TuiHintModule, TuiDataListModule,
         TuiTextfieldControllerModule, TuiLoaderModule, TuiDropdownModule,
         TuiModeModule,
         TuiThemeNightModule} from "@taiga-ui/core";
import { TuiDataListWrapperModule, TuiIslandModule, TuiSelectModule } from '@taiga-ui/kit';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiNavigationModule } from "@taiga-ui/experimental";
import { TUI_DIALOG_CLOSES_ON_BACK } from '@taiga-ui/cdk';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ServiceWorkerModule } from '@angular/service-worker';
import { iosInstructionComponent } from './shared/dialogs/ios-instruction/ios-instruction.component';

const TUI_MODULES = [
  TuiRootModule,
  TuiDialogModule,
  TuiButtonModule,
  TuiNavigationModule,
  TuiIslandModule,
  TuiNotificationModule,
  TuiTableModule,
  TuiSvgModule,
  TuiHintModule,
  TuiSelectModule,
  TuiDataListModule,
  TuiDataListWrapperModule,
  TuiTextfieldControllerModule,
  TuiLoaderModule,
  TuiDropdownModule,
  TuiModeModule,
  TuiThemeNightModule,
];

@NgModule({
  declarations: [
    AppComponent,
    TopNavbarComponent,
    PrayerTimeBaseComponent,
    NextPrayerInfoComponent,
    PrayerTimeTableComponent,
    NotificationComponent,
    ZoneSwitcherComponent,
    iosInstructionComponent,
    EpochToDatePipe,
    CountdownPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiSelectModule,
    TuiDataListModule,
    TuiDataListWrapperModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TUI_MODULES,
    TranslateModule.forRoot({
      defaultLanguage: 'ms',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerImmediately'
    }),
],
  providers: [
      {provide: TUI_SANITIZER, useClass: NgDompurifySanitizer},
      {provide: TUI_DIALOG_CLOSES_ON_BACK, useValue: of(true)},
      DatePipe,
      CountdownPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
