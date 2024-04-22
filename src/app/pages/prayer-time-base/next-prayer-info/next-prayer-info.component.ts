import { ChangeDetectionStrategy, Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { NextPrayerInfo, PrayerTime, Solat } from 'src/app/shared/interfaces/solat.model';
import { SolatService } from 'src/app/shared/services/solat.service';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { TuiDialogService } from '@taiga-ui/core';
import { ZoneSwitcherComponent } from 'src/app/shared/dialogs/zone-switcher/zone-switcher.component';
import { takeWhile } from 'rxjs';


@Component({
  selector: 'app-next-prayer-info',
  templateUrl: './next-prayer-info.component.html',
  styleUrls: ['./next-prayer-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NextPrayerInfoComponent implements OnInit {
  nextPrayer!: NextPrayerInfo;

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
              private solatApi: SolatService) {
  }

  ngOnInit(): void {
    this.nextPrayer = this.solatApi.calcNextPrayer();
    // Subscribe to the next prayer in seconds if it is less than 0.
    this.solatApi.nextPrayerInSeconds$.pipe(takeWhile(seconds => seconds >= 0))
    .subscribe(seconds => {
      if (seconds === 0) {
        this.nextPrayer = this.solatApi.calcNextPrayer();
      }
    });
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
