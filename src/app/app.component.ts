import { Component, Inject, OnInit } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import { ThemeService } from './shared/services/theme.service';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { TuiDialogService } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  nightMode$: Observable<boolean>;
  title = 'solatku';

  isOnline!: boolean;
  modalVersion!: boolean;

  constructor(@Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    private themeService: ThemeService,
    private swUpdate: SwUpdate) {
    this.nightMode$ = this.themeService.isNightTheme$;
    this.isOnline = false;
    this.modalVersion = false;
  }

  ngOnInit(): void {
    this.updateOnlineStatus();
    // Listen to online/offline events
    window.addEventListener('online', this.updateOnlineStatus.bind(this));
    window.addEventListener('offline', this.updateOnlineStatus.bind(this));

    // Listen to version updates
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.pipe(
        filter((evt: any): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        map((evt: any) => {
          console.info(`currentVersion=[${evt.currentVersion}] | latestVersion=[${evt.latestVersion}]`);
          this.modalVersion = true;
        })
      )
    }
  }

  /** Get the current theme */
  get mode() {
    return this.themeService.currentTheme;
  }

  /** Change theme */
  changeTheme(){
    this.themeService.toggleTheme();
  }

  checkUpdate(){
    console.log('tra');
    // if (this.modalVersion) {

    // }
  }

  /** Update version */
  updateVersion(): void {
    this.modalVersion = false;
    window.location.reload();
  }

  /** Close version modal */
  closeVersion(): void {
    this.modalVersion = false;
  }

  /** Update online status */
  private updateOnlineStatus(): void {
    this.isOnline = window.navigator.onLine;
    console.log(`isOnline=[${this.isOnline}]`);
  }
}
