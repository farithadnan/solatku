import { Component, Inject, Injector, OnInit } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import { ThemeService } from './shared/services/theme.service';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { TuiDialogService } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';
import { TranslatorService } from './shared/services/translator.service';
import { Platform } from '@angular/cdk/platform';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  nightMode$: Observable<boolean>;
  title = 'solatku';

  isOnline!: boolean;
  wasOffline = false;
  modalPwaEvent: any;
  modalPwaPlatform: string|undefined;

  constructor(@Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    private platform: Platform,
    private translator: TranslatorService,
    private themeService: ThemeService,
    private toastr: ToastrService,
    private swUpdate: SwUpdate) {
    this.nightMode$ = this.themeService.isNightTheme$;
    this.isOnline = false;
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
          this.updatePwaDialog();
        })
      )
    }

    this.loadModalPwa();
  }

  /** Get the current theme */
  get mode() {
    return this.themeService.currentTheme;
  }

  /** Change theme */
  changeTheme(){
    this.themeService.toggleTheme();
  }

  /** Dialog to update PWA */
  async updatePwaDialog(){
    this.dialogs.open<boolean>(TUI_PROMPT, {
      label: await this.translator.getTranslation('solatku.check_update_section.title'),
      data: {
        content: await this.translator.getTranslation('solatku.check_update_section.have_update'),
        yes: await this.translator.getTranslation('solatku.check_update_section.button.confirm'),
        no: await this.translator.getTranslation('solatku.check_update_section.button.cancel'),
      },
    }).subscribe(response => {
      if (response) {
        window.location.reload();
      }
    })
  }


  /** Add to home screen */
  addToHomeScreen(): void {
    this.modalPwaEvent.prompt();
    this.modalPwaPlatform = undefined;
  }

  /** Load PWA modal */
  private loadModalPwa(): void {
    // Check if the user is using Android
    if (this.platform.ANDROID) {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event?.preventDefault();
        this.modalPwaEvent = event;
        this.modalPwaPlatform = 'ANDROID';
      });
    }

    // Check if the user is using iOS and not in standalone mode
    if (this.platform.IOS && this.platform.SAFARI) {
      const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;
      if (!isInStandaloneMode) {
        this.modalPwaPlatform = 'IOS';
      }
    }
  }

  /** Update online status */
  private updateOnlineStatus(): void {
    const wasOnline = this.isOnline;
    this.isOnline = window.navigator.onLine;

    // If the user was online and now is offline
    if (wasOnline && !this.isOnline) {
      this.wasOffline = true;
    }

    // If the user was offline and now is online
    if (this.isOnline && this.wasOffline) {
      setTimeout(() => {
        this.hideConnectionBar();
      }, 3000);
    }
  }

  /** Hide connection bar */
  private hideConnectionBar(): void {
    const bar = document.getElementById('connection-bar-id');
    if (bar) {
      bar.classList.add('hide');
      setTimeout(() => {
        this.wasOffline = false;
        bar.classList.remove('hide');
      }, 500)
    }
  }
}
