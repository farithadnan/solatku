import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class TranslatorService {
  defaultLanguages: string[] = ['ms', 'en'];
  constructor(private translate: TranslateService, private toastr: ToastrService) {
    this.initLanguage();
  }

  /** Set default browser language */
  initLanguage() {
    const setLanguage = localStorage.getItem('lang');
    this.translate.addLangs(this.defaultLanguages);

    if (!setLanguage) {
      localStorage.setItem('lang', this.translate.getDefaultLang())
      return;
    }

    this.translate.setDefaultLang(setLanguage);
    this.translate.use(setLanguage);
  }

  /**
   * Change language based on language code.
   * @param lang a language code
   */
  changeLanguage(lang: string) {
    if (!lang || !this.defaultLanguages.find(x => x === lang)) {
      this.toastr.error('Invalid language selected', 'Error');
      return;
    }

    localStorage.setItem('lang', lang);
    this.translate.use(lang);
  }

  /**
   * Get the set language.
   * @returns a language code
   */
  getSetLanguage(): string {
    return localStorage.getItem('lang') || this.translate.getDefaultLang();
  }

  /**
   * Get translation based on label provided.
   * @param label a label to be translated.
   * @returns a translated string.
   */
  getTranslation(label: string): string {
    let result: string = 'NaN';
    this.translate.get(label).subscribe((res: string) => {
      result = res;
    });
    return result;
  }
}
