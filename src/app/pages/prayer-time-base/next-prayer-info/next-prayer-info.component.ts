import { Component, Inject, Injector, OnInit } from '@angular/core';
import { NextPrayerInfo } from 'src/app/shared/interfaces/solat.model';
import { SolatService } from 'src/app/shared/services/solat.service';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { TuiDialogService } from '@taiga-ui/core';
import { ZoneSwitcherComponent } from 'src/app/shared/dialogs/zone-switcher/zone-switcher.component';
import { takeWhile } from 'rxjs';
import { GroupZone, Zone } from 'src/app/shared/interfaces/zone.model';
import { ZoneService } from 'src/app/shared/services/zone.service';


@Component({
  selector: 'app-next-prayer-info',
  templateUrl: './next-prayer-info.component.html',
  styleUrls: ['./next-prayer-info.component.less'],
})
export class NextPrayerInfoComponent implements OnInit {
  nextPrayer!: NextPrayerInfo;
  zoneData: GroupZone[] = [];

  errorTitle: string = 'Ralat';
  errorMessage: string = 'Maaf, data waktu solat tidak tersedia. Sila cuba sebentar lagi.';

  constructor(@Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
              @Inject(Injector) private readonly injector: Injector,
              private zoneApi: ZoneService,
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

    this.zoneApi.getZones().subscribe((data: Zone[]) => {
      this.zoneData = this.zoneApi.groupZoneByState(data);
    })
  }

  /**
   * Open the dialog for zone switcher.
   */
  openDialog() {
    this.dialogs.open(
      new PolymorpheusComponent(ZoneSwitcherComponent, this.injector),
      {
        data: this.zoneData,
        size: 'm',
        dismissible: false,
        label: 'Tukar Zon',
      }
    ).subscribe({
      next: data => {
        console.log("Data emitted: ", data);
      },
      complete() {
        console.log("Dialog closed");
      },
    })
  }
}
