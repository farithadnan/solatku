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
  highlightedRow: boolean[] | Promise<boolean>[] = [];
  icons: string[] = ['tuiIconMoon', 'tuiIconMoon', 'tuiIconSunrise', 'tuiIconSun', 'tuiIconSunset', 'tuiIconMoon', 'tuiIconMoon']
  loading: boolean = false;

  constructor(private dateFilter: DateFilterService, private solatApi: SolatService, private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    this.loading = true;
    this.initPrayerTimeTable();
    combineLatest([this.solatApi.zone$, this.solatApi.district$]).subscribe(async ([zone, district]) => {
      if (!zone || !district) {
        this.loading = false;
        return;
      }
      this.initPrayerTimeTable();
    })
    this.loading = false;
  }


  /**
   * Initialize the prayer time table.
   */
  initPrayerTimeTable(): void {
    this.solatApi.getPrayerTimeByCode().subscribe((data: Solat) => {
      const monthlyData = data;
      const todayPrayerTimes = this.solatApi.getPrayerTimeViaDate(monthlyData) as PrayerTime;

      this.prayerInfo = this.filterPrayerTimes(todayPrayerTimes);
      this.prayerInfo.push(this.solatApi.getUpcomingFajrTimes(new Date(), monthlyData));
      this.highlightedRow = this.prayerInfo.map((info, index) => {
        return this.isCurrentPrayer(info.name, info.time, this.prayerInfo[index + 1]?.time);
      });

      this.prayerInfo.splice(7);
      this.prayerInfo = this.setPrayerIcon(this.prayerInfo);
      this.cdr.detectChanges();
    });
  }

  /**
   * Check if the current time is within the prayer time.
   * @param prayerName a prayer name.
   * @param startTime a start time of the prayer.
   * @param endTime a start time of the next prayer.
   * @returns a boolean value.
   */
  isCurrentPrayer(prayerName: string, startTime: Date, nextPrayerTime: Date | undefined): boolean {
    if (!nextPrayerTime) {
      return false;
    }

    // Syuruk period is 28 minutes.
    if (prayerName === PrayerTimeName.syuruk) {
      nextPrayerTime = new Date(startTime.getTime() + 28 * 60000);
    }

    const now = new Date();
    return now >= startTime && now < nextPrayerTime;
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
          if (prayerName === PrayerTimeName.fajr) {
            return [
              { name: PrayerTimeName.imsak, time: new Date(value * 1000 - 10 * 60000) },
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
