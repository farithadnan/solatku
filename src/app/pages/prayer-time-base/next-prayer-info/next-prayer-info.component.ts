import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class NextPrayerInfoComponent implements OnChanges {
  @Input() prayerTimes!: PrayerTime;
  @Input() monthlyTimes!: Solat;

  todayPrayers: NextPrayerInfo[] = [];
  nextPrayer!: NextPrayerInfo;

  nextPrayerName: string = '';
  nextPrayerInSeconds: number = 0;

  errorTitle: string = 'Ralat';
  errorMessage: string = 'Maaf, data waktu solat tidak tersedia. Sila cuba sebentar lagi.'

  constructor(private solatApi: SolatService,
              private dateFilter: DateFilterService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('prayerTimes' in changes && 'monthlyTimes' in changes) {
      this.calculateNextPrayer();
    }
  }

  /**
   * Dissect prayer times from PrayerTime object.
   * @param originData todays prayer times including zone & hijri date.
   * @returns a list of todays prayer info.
   */
  private getPrayerTimes(originData: PrayerTime) {
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
   * Get the next prayer name.
   * @param data todays prayer times including zone & hijri date.
   * @returns the next prayer names (string).
   */
  private calculateNextPrayer(): void {
    if (!this.prayerTimes || !this.monthlyTimes) {
      return;
    }

    const now = new Date();
    this.todayPrayers = this.getPrayerTimes(this.prayerTimes);
    const nextPrayerList = this.filterUpcomingPrayers(this.todayPrayers, now);

    if (nextPrayerList.length < 1) {
      // Fetch tomorrow's prayer times
      this.nextPrayer = this.getUpcomingFajrTimes(now, this.monthlyTimes);
    } else {
      // Sort future by closest to the current time.
      this.nextPrayer = this.sortByTime(nextPrayerList)[0];
    }

    this.nextPrayerInSeconds = this.getDurationInSeconds(this.nextPrayer.time);
    this.nextPrayerName = this.nextPrayer.name;
  }

  /**
 * Filter upcoming prayer info for today.
 * @param todayPrayerTimes list of today's prayer times.
 * @param currentTime current dateTime.
 * @returns a list of the next upcoming prayer for today.
 */
  private filterUpcomingPrayers(todayPrayerTimes: NextPrayerInfo[], currentTime: Date) {
    return todayPrayerTimes.filter(prayer => {
      return (prayer.time > currentTime) && prayer.name !== 'Imsak' && prayer.name !== 'Syuruk'
    });
  }

  /**
 * Sort via the closest upcoming prayer to the current time.
 * @param todayPrayerTimes list of today's prayer times.
 * @returns a sorted prayer times.
 */
  private sortByTime(todayPrayerTimes: NextPrayerInfo[]) {
    return todayPrayerTimes.sort((now, nxt) => now.time.getTime() - nxt.time.getTime());
  }

  /**
   * Get next fajr prayer info.
   * @param todayDate current dateTime.
   * @param monthlyTimes current month data of prayer time info.
   * @returns The next fajr prayer time info.
   */
  private getUpcomingFajrTimes(todayDate: Date, monthlyTimes: Solat) {
    let tomorrow = todayDate;
    tomorrow.setDate(todayDate.getDate() + 1);
    const tomorrowTimes = this.solatApi.getPrayerTimeViaDate(monthlyTimes, tomorrow);
    const subuh: NextPrayerInfo = {
      name: "Subuh",
      time: this.dateFilter.epochToJsDate(tomorrowTimes.fajr)
    }
    return subuh;
  }

  /**
 * Get the duration of the next prayer in seconds.
 * @param targetDate a target date to calculate the duration.
 * @returns a duration in seconds.
 */
  private getDurationInSeconds(targetDate: Date) {
    const currentDate = new Date();
    const milliseconds = targetDate.getTime() - currentDate.getTime();
    const seconds = Math.floor(milliseconds / 1000);
    return seconds;
  }

  /**
   * Get the name of the district.
   * @returns the name of the district.
   */
  getDistrictName() {
    return localStorage.getItem('district');
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
}
