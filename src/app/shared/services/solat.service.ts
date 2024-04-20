import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http"

import { lastValueFrom } from "rxjs";
import { ToastrService } from "ngx-toastr";

import { ApiService } from "./api.service";
import { Zone } from "../interfaces/zone.model";
import { NextPrayerInfo, PrayerTime, Solat } from "../interfaces/solat.model";
import { DateFilterService } from "./date-filter.service";

@Injectable({
  providedIn: 'root'
})
export class SolatService{
  zone: string = 'WLY01';
  district: string = 'Kuala Lumpur';
  todayPrayers!: PrayerTime;
  monthlyPrayers!: Solat;

  constructor(private api: ApiService,
              private toastr: ToastrService,
              private dt: DateFilterService,
              private http: HttpClient) {
    this.initMonthlyPrayers();
  }

  /**
   * Initialize the monthly prayer times.
   * @param zone a string that represent the zone code in Malaysia.
   */
  async initMonthlyPrayers(zone = this.zone) {
    try {
      this.monthlyPrayers = await this.getPrayerTimeByCode(zone);
      this.todayPrayers = this.getPrayerTimeViaDate(this.monthlyPrayers);
    } catch (error) {
      this.toastr.error('Failed to fetch prayer times', 'Error');
    }
  }

  calcNextPrayer(): NextPrayerInfo {
    const now = new Date();
    const mappedTodaysData = this.mapPrayerTimes(this.todayPrayers);
    const nextPrayerList = this.filterUpcomingPrayers(mappedTodaysData, now);
    let nextPrayer: NextPrayerInfo;

    if (nextPrayerList.length < 1) {
      // Fetch tomorrow's prayer times
      nextPrayer = this.getUpcomingFajrTimes(now, this.monthlyPrayers);
    } else {
      // Sort future by closest to the current time.
      nextPrayer = this.sortByTime(nextPrayerList)[0];
    }

    nextPrayer.inSeconds = this.getDurationInSeconds(nextPrayer.time);
    return nextPrayer;
  }

  mapPrayerTimes(originData: PrayerTime): NextPrayerInfo[] {
    const imsak = this.calcImsakTime(originData.fajr);
    const fajr = this.dt.unixToDate(originData.fajr);
    const syuruk = this.dt.unixToDate(originData.syuruk);
    const zohor = this.dt.unixToDate(originData.dhuhr);
    const asar = this.dt.unixToDate(originData.asr);
    const maghrib = this.dt.unixToDate(originData.maghrib);
    const isyak = this.dt.unixToDate(originData.isha);


    return [
      { name: 'Imsak', time: imsak, inSeconds: this.getDurationInSeconds(imsak)},
      { name: 'Subuh', time: fajr, inSeconds: this.getDurationInSeconds(fajr)},
      { name: 'Syuruk', time: syuruk, inSeconds: this.getDurationInSeconds(syuruk)},
      { name: 'Zohor', time: zohor, inSeconds: this.getDurationInSeconds(zohor)},
      { name: 'Asar', time: this.dt.unixToDate(originData.asr), inSeconds: this.getDurationInSeconds(asar)},
      { name: 'Maghrib', time: this.dt.unixToDate(originData.maghrib), inSeconds: this.getDurationInSeconds(this.dt.unixToDate(originData.maghrib))},
      { name: 'Isyak', time: this.dt.unixToDate(originData.isha), inSeconds: this.getDurationInSeconds(this.dt.unixToDate(originData.isha))}
    ];
  }

  /**
 * Retrieves prayer times for a specified zone.
 * @param zone The code of the zone in Malaysia.
 * @param year The year. Defaults to the current year.
 * @param month The month. Defaults to the current month (1-indexed).
 * @returns a Solat object that contains the prayer times.
 */
  async getPrayerTimeByCode(zone: string, year: number = new Date().getFullYear(), month: number = new Date().getMonth() + 1): Promise<Solat> {
    const params = this.getPrayerTimeParams(year, month);
    return await lastValueFrom(this.http.get<Solat>(`${this.api.prayerTimeUri}/${zone}`, { params: params }));
  }

  /**
   * Get the prayer time info by zone code of a specific date
   * @param data a Solat object that contains the zone code and date.
   * @param date a Date object that represent the specific date. Default is today.
   * @returns a Solat object that contains the prayer time on the specific date.
   */
  getPrayerTimeViaDate(data: Solat, date: Date = new Date()): PrayerTime {
    if (!data) {
      this.toastr.error("Data prayer is empty!");
      throw new Error('Data is empty');
    }

    let prayerTime!: PrayerTime;
    const day = this.dt.splitGregorian(date, 'dd-MM-yyyy', '-')[0];

    data.prayers.filter(prayer => {
      if (prayer.day == day) {
        prayerTime = prayer;
      }
    })

    return prayerTime;
  }

  /**
   * Sort the prayer list by the order of the prayer.
   * @param prayerList a list of NextPrayerInfo array.
   * @returns a sorted list of NextPrayerInfo array.
   */
  sortByPrayer(prayerList: NextPrayerInfo[]) {
    const order = ['Imsak', 'Subuh', 'Syuruk', 'Zohor', 'Asar', 'Maghrib', 'Isyak'];
    return prayerList.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
  }

  /**
   * Get the zone information by zone code.
   * @param zone a string that represent the zone code in Malaysia.
   * @returns a Zone object that contains the information of the zone.
   */
  async getZoneByCode(zone: string): Promise<Zone> {
    try {
      return await lastValueFrom(this.http.get<Zone>(`${this.api.zoneUri}/${zone}`));
    } catch (error) {
      console.error('Error:', error);

      if (error instanceof HttpErrorResponse) {
        if (error.status === 404) {
          this.toastr.error('Zone code not found');
          throw error;
        }

        if (error.status === 500) {
          this.toastr.error('Internal server error');
          throw error;
        }

        this.toastr.error('An unexpected error occurred');
      }
      throw error;
    }
  }

  /**
 * Set the parameter for getting prayer time for http request.
 * @param year a number that represent the year.
 * @param month a number that represent the month.
 * @returns a HttpParams object that contains the year and month.
 */
  private getPrayerTimeParams(year?: number, month?: number) {
    let params = new HttpParams();
    if (year) {
      params = params.set('year', year.toString());
    }
    if (month) {
      params = params.set('month', month.toString());
    }
    return params;
  }

/**
 * Calculate the imsak time based on the fajr time.
 * @param fajrTimestamp a number that represent the fajr time.
 * @returns a Date() object that represent the imsak time.
 */
  private calcImsakTime(fajrTimestamp: number) {
    const fajrTime = this.dt.unixToDate(fajrTimestamp);
    return new Date(fajrTime.getTime() - 10 * 60000);
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
 * Get next fajr prayer info.
 * @param todayDate current dateTime.
 * @param monthlyTimes current month data of prayer time info.
 * @returns The next fajr prayer time info.
 */
  private getUpcomingFajrTimes(todayDate: Date, monthlyTimes: Solat) {
    let tomorrow = todayDate;
    tomorrow.setDate(todayDate.getDate() + 1);
    const tomorrowTimes = this.getPrayerTimeViaDate(monthlyTimes, tomorrow);
    const fajrTime = this.dt.unixToDate(tomorrowTimes.fajr);
    const nextSubuhInfo: NextPrayerInfo = {
      name: "Subuh",
      time: fajrTime,
      inSeconds: this.getDurationInSeconds(fajrTime)
    }
    return nextSubuhInfo;
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
}
