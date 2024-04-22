import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'app-zone-switcher',
  templateUrl: './zone-switcher.component.html',
  styleUrls: ['./zone-switcher.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoneSwitcherComponent {
  value: number | null = null;
  size: 's' | 'm' | 'l' = 'm';
  placeholder = 'Pilih Zon Anda';
  items = [10, 50, 100];
  constructor(@Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
              @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<number, number>) {}

  get data(): number {
    return this.context.data;
  }

  submit(): void {
    if (this.value !== null) {
      this.context.completeWith(this.value);
    }
  }
}
