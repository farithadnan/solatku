import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';
  private isNightTheme = new BehaviorSubject<boolean>(this.getStoredTheme());
  public isNightTheme$ = this.isNightTheme.asObservable();

  /**
   * Toggle the theme between night and day
   */
  toggleTheme() {
    const newTheme = this.isNightTheme.value;
    this.isNightTheme.next(!this.isNightTheme.value);
    localStorage.setItem(this.THEME_KEY, newTheme ? 'day' : 'night');
  }

  /**
   * Get the current theme
   */
  get currentTheme() {
    return this.isNightTheme.value ? 'onDark' : null;
  }

  /**
   * Get the stored theme from local storage
   * @returns a boolean value of the stored theme
   */
  private getStoredTheme(): boolean {
    return localStorage.getItem(this.THEME_KEY) === 'night';
  }
}
