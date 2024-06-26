import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class FooterComponent {
    currentYear: number;

    constructor() {
        this.currentYear = new Date().getFullYear();
    }
  }
