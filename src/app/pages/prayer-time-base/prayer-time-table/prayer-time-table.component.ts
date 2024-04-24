import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
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
  icons: string[] = ['tuiIconMoon', 'tuiIconMoon', 'tuiIconSunrise', 'tuiIconSun', 'tuiIconSunset', 'tuiIconMoon', 'tuiIconMoon']


  errorTitle: string = 'Ralat';
  errorMessage: string = 'Maaf, data waktu solat tidak tersedia. Sila cuba sebentar lagi.'

  constructor(private dateFilter: DateFilterService, private solatApi: SolatService, private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    this.initPrayerTimeTable();
    combineLatest([this.solatApi.zone$, this.solatApi.district$]).subscribe(async ([zone, district]) => {
      if (!zone || !district) {
        return;
      }
      this.initPrayerTimeTable();
    })
  }


  /**
   * Initialize the prayer time table.
   */
  initPrayerTimeTable(): void {
    this.solatApi.getPrayerTimeByCode().subscribe((data: Solat) => {
      const monthlyData = data;
      const todayPrayerTimes = this.solatApi.getPrayerTimeViaDate(monthlyData) as PrayerTime;
      this.prayerInfo = this.filterPrayerTimes(todayPrayerTimes);
      this.prayerInfo = this.setPrayerIcon(this.prayerInfo);
      this.cdr.detectChanges();
    });
  }

  /**
   * Set the icon for each prayer time.
   * @param prayerInfo a list of NextPrayerInfo
   * @returns a list of NextPrayerInfo with icon
   */
  private setPrayerIcon(prayerInfo: NextPrayerInfo[]): NextPrayerInfo[] {
    return prayerInfo.map((info, index) => {
      info.icon = this.icons[index];
      return info;
    });
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
            return [
              { name: 'Imsak', time: new Date(value * 1000 - 10 * 60000) },
              { name: prayerName, time: this.dateFilter.unixToDate(value) }
            ]
          }
          return { name: prayerName, time: this.dateFilter.unixToDate(value) }
        }
        return null;
      })
      .flat()
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
