import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslatorService } from './shared/services/translator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'solatku';

constructor(private translator: TranslatorService) {

}
}
