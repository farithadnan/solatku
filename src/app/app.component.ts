import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'solatku';

constructor(translate: TranslateService) {
  translate.setDefaultLang('ms');
  translate.use('ms');
}
}
