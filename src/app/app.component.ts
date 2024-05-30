import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  nightMode$: Observable<boolean>;
  title = 'solatku';

  constructor(private themeService: ThemeService) {
    this.nightMode$ = this.themeService.isNightTheme$;
  }

  /** Get the current theme */
  get mode() {
    return this.themeService.currentTheme;
  }

  /** Change theme */
  changeTheme(){
    this.themeService.toggleTheme();
  }
}
