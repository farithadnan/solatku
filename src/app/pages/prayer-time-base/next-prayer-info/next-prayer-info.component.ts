import { ChangeDetectionStrategy, Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { NextPrayerInfo, PrayerTime, Solat } from 'src/app/shared/interfaces/solat.model';
import { DateFilterService } from 'src/app/shared/services/date-filter.service';
import { SolatService } from 'src/app/shared/services/solat.service';

import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { TuiDialogService } from '@taiga-ui/core';

import { ZoneSwitcherComponent } from 'src/app/shared/dialogs/zone-switcher/zone-switcher.component';


@Component({
  selector: 'app-next-prayer-info',
  templateUrl: './next-prayer-info.component.html',
  styleUrls: ['./next-prayer-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NextPrayerInfoComponent implements OnInit {
  @Input() prayerTimes!: PrayerTime;
  @Input() monthlyTimes!: Solat;

  todayPrayers: NextPrayerInfo[] = [];
  nextPrayer!: NextPrayerInfo;

  nextPrayerName: string = '';
  nextPrayerInSeconds: number = 0;

  errorTitle: string = 'Ralat';
  errorMessage: string = 'Maaf, data waktu solat tidak tersedia. Sila cuba sebentar lagi.'

  private readonly dialog = this.dialogs.open<number>(
    new PolymorpheusComponent(ZoneSwitcherComponent, this.injector),
    {
      data: 237,
      dismissible: false,
      label: 'Tukar Zone Waktu Solat',
    }
  );

  constructor(@Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
              @Inject(Injector) private readonly injector: Injector,
              private solatApi: SolatService,
              private dateFilter: DateFilterService) {
  }

  ngOnInit(): void {
    this.nextPrayer = this.solatApi.calcNextPrayer();
  }

  /**
   * Open the dialog for zone switcher.
   */
  openDialog() {
    this.dialog.subscribe({
      next: data => {
        console.log("Data emitted: ", data);
      },
      complete() {
        console.log("Dialog closed");
      },
    })
  }
}
