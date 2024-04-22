import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { PrayerTimeName } from 'src/app/shared/enums/date.enum';
import { NextPrayerInfo, PrayerTime, Solat } from 'src/app/shared/interfaces/solat.model';
import { DateFilterService } from 'src/app/shared/services/date-filter.service';
import { SolatService } from 'src/app/shared/services/solat.service';

@Component({
  selector: 'app-prayer-time-table',
  templateUrl: './prayer-time-table.component.html',
  styleUrls: ['./prayer-time-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrayerTimeTableComponent implements OnInit {
  prayerInfo: NextPrayerInfo[] = [];

  errorTitle: string = 'Ralat';
  errorMessage: string = 'Maaf, data waktu solat tidak tersedia. Sila cuba sebentar lagi.'

  constructor(private dateFilter: DateFilterService, private solatApi: SolatService, private cdr: ChangeDetectorRef){}

  async ngOnInit(): Promise<void> {
    const monthlyData = await this.solatApi.getPrayerTimeByCode(this.solatApi.zone);
    const todayPrayerTimes = this.solatApi.getPrayerTimeViaDate(monthlyData);
    this.prayerInfo = this.filterPrayerTimes(todayPrayerTimes);
    this.cdr.detectChanges();
  }


  /**
   * Filter the prayer times from the PrayerTime object.
   * @param prayerTimes a PrayerTime object
   * @returns a list of NextPrayerInfo
   */
  private filterPrayerTimes(prayerTimes: PrayerTime): NextPrayerInfo[] {
    let prayerList =  Object.entries(prayerTimes)
      .filter(([key, value]) => key !== 'hijri' && key !== 'day')
      .map(([key, value]) => {
        const prayerName = this.getPrayerName(key as keyof typeof PrayerTimeName);
        if (prayerName) {
          if (prayerName === 'Subuh') {
            return { name: 'Imsak', time: new Date(value * 1000 - 10 * 60000) }
          }
          return { name: prayerName, time: this.dateFilter.unixToDate(value) }
        }
        return null;
      })
      .filter(info => info !== null) as NextPrayerInfo[];

    return this.solatApi.sortByPrayer(prayerList);
  }

  /**
   * Get the prayer name by key.
   * @param key a key of PrayerTimeName enum
   * @returns a string of prayer name
   */
  private getPrayerName(key: keyof typeof PrayerTimeName): string | null {
    if (PrayerTimeName[key]) {
      return PrayerTimeName[key];
    }
    return null;
  }
}
