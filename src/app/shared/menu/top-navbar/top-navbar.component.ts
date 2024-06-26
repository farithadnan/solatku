import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { TranslatorService } from '../../services/translator.service';
import { ToastrService } from 'ngx-toastr';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopNavbarComponent implements OnInit{
  @Output() themeToggle = new EventEmitter<void>();
  @Output() pwaAndroid = new EventEmitter<void>();
  @Output() pwaIos = new EventEmitter<void>();
  @Input() mobilePlatform!: string | undefined;
  @Input() isMobile!: boolean;

  constructor(private translator: TranslatorService, private toastr: ToastrService, public themeService: ThemeService) { }

  ngOnInit(): void {
  }

  /** Change Language */
  async changeLanguage(event: any) {
    const selectedLanguage = event.target.value;
    if (this.translator.getSetLanguage() === selectedLanguage) {
      return;
    }
    this.translator.changeLanguage(selectedLanguage);

    const title = await this.translator.getTranslation('solatku.toastr.title.success');
    const message = await this.translator.getTranslation('solatku.toastr.zone_switcher_section.language_change_success_msg');
    this.toastr.success(message, title);
  }

  /** Change theme */
  changeTheme() {
    this.themeToggle.emit();
  }

  /** Install PWA */
  installPWA() {
    if (this.mobilePlatform === 'ANDROID') {
      this.pwaAndroid.emit();
      return;
    }
    this.pwaIos.emit();
  }

  get themeIcon(): string {
    return this.themeService.currentTheme === 'onDark' ? 'tuiIconSunLarge' : 'tuiIconMoonLarge';
  }
}
