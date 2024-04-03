import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, map, timer } from 'rxjs';
import { IslamicMonth } from 'src/app/shared/enums/date.enum';
import { NextPrayerInfo, PrayerTime, Solat } from 'src/app/shared/interfaces/solat.model';
import { DateFilterService } from 'src/app/shared/services/date-filter.service';
import { SolatService } from 'src/app/shared/services/solat.service';

@Component({
  selector: 'app-next-prayer-info',
  templateUrl: './next-prayer-info.component.html',
  styleUrls: ['./next-prayer-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NextPrayerInfoComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  countdown$!: Observable<number>;
  hours: string = '';
  minutes: string = '';
  seconds: string = '';
  showHours: boolean = false;
  showMinutes: boolean = false;

  @Input() prayerTimes!: PrayerTime;
  @Input() monthlyTimes!: Solat;

  todayPrayers: NextPrayerInfo[] = [];
  nextPrayer!: NextPrayerInfo;

  constructor(private solatApi: SolatService, private dateFilter: DateFilterService) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Get the next prayer name.
   * @param data todays prayer times including zone & hijri date.
   * @returns the next prayer names (string).
   */
  getNextPrayerName(data: PrayerTime) {
    const now = new Date();
    this.todayPrayers = this.getPrayerTimes(data);
    const nextPrayerList = this.filterUpcomingPrayers(this.todayPrayers, now);

    if (nextPrayerList.length < 1) {
      // Fetch tomorrow's prayer times
      this.nextPrayer = this.getUpcomingFajrTimes(now, this.monthlyTimes);
      return this.nextPrayer.name;
    }

    // Sort future by closest to the current time.
    this.nextPrayer = this.sortByTime(nextPrayerList)[0];
    return this.nextPrayer.name
  }


  /**
   * Get and format hijri date.
   * @param hijriDate todays hijri date.
   * @returns a formatted hijri date.
   */
  getTodayHijriDate(hijriDate: string) {
    const [year, month, day] = this.dateFilter.splitHijri(hijriDate, '-');
    // -1 because it uses 0-based index.
    const monthName = Object.values(IslamicMonth)[month - 1];
    return `${day} ${monthName} ${year}`
  }

  /**
   * Get current DateTime.
   * @returns Return current dateTime.
   */
  getTodaysDate() {
    return new Date()
  }


  getCountdown() {
    const startTime = new Date().getTime();
    const endTime = this.nextPrayer.time.getTime();
    const countdownDuration = Math.floor((endTime - startTime) / 1000);

    this.countdown$ = timer(0, 1000).pipe(
      map(() => {
        const currentTime = new Date();
        const remainingTime = Math.floor((endTime - currentTime.getTime()) / 1000);

        if (remainingTime <= 0) {
          this.subscription.unsubscribe();
          return 0;
        }

        this.showHours = remainingTime >= 3600;
        this.showMinutes = remainingTime >= 60;

        return remainingTime;
      })
    );

    this.subscription = this.countdown$.subscribe(time => {
      this.hours = this.formatNumber(Math.floor(time / 3600));
      this.minutes = this.formatNumber(Math.floor((time % 3600) / 60));
      this.seconds = this.formatNumber(time % 60);
    });

  }

  // Helper function to format numbers to two digits with leading zero
  private formatNumber(value: number): string {
    return value < 10 ? '0' + value : '' + value;
  }

  /**
   * Dissect prayer times from PrayerTime object.
   * @param originData todays prayer times including zone & hijri date.
   * @returns a list of todays prayer info.
   */
  getPrayerTimes(originData: PrayerTime) {
    const fajrTime = this.dateFilter.epochToJsDate(originData.fajr);
    const imsakTime = new Date(fajrTime.getTime() - 10 * 60000);

    return [
      { name: 'Imsak', time: imsakTime },
      { name: 'Subuh', time: fajrTime },
      { name: 'Syuruk', time: this.dateFilter.epochToJsDate(originData.syuruk) },
      { name: 'Zohor', time: this.dateFilter.epochToJsDate(originData.dhuhr) },
      { name: 'Asar', time: this.dateFilter.epochToJsDate(originData.asr) },
      { name: 'Maghrib', time: this.dateFilter.epochToJsDate(originData.maghrib) },
      { name: 'Isyak', time: this.dateFilter.epochToJsDate(originData.isha) }
    ];
  }

  /**
   * Filter upcoming prayer info for today.
   * @param todayPrayerTimes list of today's prayer times.
   * @param currentTime current dateTime.
   * @returns a list of the next upcoming prayer for today.
   */
  filterUpcomingPrayers(todayPrayerTimes: NextPrayerInfo[], currentTime: Date) {
    return todayPrayerTimes.filter(prayer => {
      (prayer.time > currentTime) && prayer.name !== 'Imsak' && prayer.name !== 'Syuruk'
    });
  }

  /**
   * Sort via the closest upcoming prayer to the current time.
   * @param todayPrayerTimes list of today's prayer times.
   * @returns a sorted prayer times.
   */
  sortByTime(todayPrayerTimes: NextPrayerInfo[]) {
    return todayPrayerTimes.sort((now, nxt) => now.time.getTime() - nxt.time.getTime());
  }

  /**
   * Get next fajr prayer info.
   * @param todayDate current dateTime.
   * @param monthlyTimes current month data of prayer time info.
   * @returns The next fajr prayer time info.
   */
  getUpcomingFajrTimes(todayDate: Date, monthlyTimes: Solat) {
    let tomorrow = todayDate;
    tomorrow.setDate(todayDate.getDate() + 1);
    const tomorrowTimes = this.solatApi.getPrayerTimeViaDate(monthlyTimes, tomorrow);
    const subuh: NextPrayerInfo = {
      name: "Subuh",
      time: this.dateFilter.epochToJsDate(tomorrowTimes.fajr)
    }
    return subuh;
  }

}
