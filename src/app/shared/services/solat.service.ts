import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http"
import { BehaviorSubject, Observable, Subject, catchError, lastValueFrom, throwError } from "rxjs";
import { ToastrService } from "ngx-toastr";

import { ApiService } from "./api.service";
import { NextPrayerInfo, PrayerTime, Solat } from "../interfaces/solat.model";
import { DateFilterService } from "./date-filter.service";
import { IslamicMonth, PrayerTimeName } from "../enums/date.enum";

@Injectable({
  providedIn: 'root'
})
export class SolatService{
  private zoneSubject = new BehaviorSubject<string>('WLY01');
  private districtSubject = new BehaviorSubject<string>('Kuala Lumpur, Putrajaya');

  zone$ = this.zoneSubject.asObservable();
  district$ = this.districtSubject.asObservable();
  prayerNames: PrayerTimeName[] = [
    PrayerTimeName.imsak,
    PrayerTimeName.fajr,
    PrayerTimeName.syuruk,
    PrayerTimeName.dhuhr,
    PrayerTimeName.asr,
    PrayerTimeName.maghrib,
    PrayerTimeName.isha
  ];

  todayPrayers!: PrayerTime;
  monthlyPrayers!: Solat;

  constructor(private api: ApiService,
              private toastr: ToastrService,
              private dt: DateFilterService,
              private http: HttpClient) {
    this.initStorage();
  }

  /**
   * Check & set the local storage for the zone and district.
   * @summary This trigger during the first time the app is loaded. Where the zone and district is not set yet in the local storage.
   */
  initStorage() {
    if (localStorage.getItem('zone')) {
      const zone = localStorage.getItem('zone')!;
      this.updateZone(zone);
    } else {
      localStorage.setItem('zone', this.zoneSubject.getValue());
    }

    if (localStorage.getItem('district')) {
      const district = localStorage.getItem('district')!;
      this.updateDistrict(district);
    } else {
      localStorage.setItem('district', this.districtSubject.getValue());
    }
  }

  /**
   * Update zone's based on user selection.
   * @param zone a string that represent the zone code in Malaysia.
   */
  updateZone(zone: string) {
    localStorage.setItem('zone', zone);
    this.zoneSubject.next(zone);
  }

  /**
   * Update district's based on user selection.
   * @param district a string that represent the district in Malaysia.
   */
  updateDistrict(district: string) {
    localStorage.setItem('district', district);
    this.districtSubject.next(district);
  }

  /**
   * Initialize the monthly prayer times.
   * @param zone a string that represent the zone code in Malaysia.
   */
  async setPrayersData(zone = this.zoneSubject.getValue()) {
    try {
      const prayers: Solat = await lastValueFrom(this.getPrayerTimeByCode(zone));
      const monthlyPrayers = prayers;
      const todayPrayers = this.getPrayerTimeViaDate(monthlyPrayers);
      return { monthlyPrayers, todayPrayers };
    } catch (error) {
      this.toastr.error('Failed to fetch prayer times', 'Error');
      throw error;
    }
  }
  /**
   * Calculate the next prayer time.
   * @returns a NextPrayerInfo object that contains the next prayer time.
   */
  async calcNextPrayer(): Promise<NextPrayerInfo> {
    try {
      const now = new Date();
      const { monthlyPrayers, todayPrayers } =  await this.setPrayersData();

      const mappedTodaysData = this.mapPrayerTimes(todayPrayers!);
      const nextPrayerList = this.filterUpcomingPrayers(mappedTodaysData, now);

      let nextPrayer: NextPrayerInfo;
      if (nextPrayerList.length < 1) {
        nextPrayer = this.getUpcomingFajrTimes(now, monthlyPrayers);
      } else {
        nextPrayer = this.sortByTime(nextPrayerList)[0];
      }

      nextPrayer.inSeconds = this.getDurationInSeconds(nextPrayer.time);
      return nextPrayer;
    } catch (error) {
      this.toastr.error('Failed to fetch prayer times', 'Error');
      throw error;
    }
  }

  /**
 * Retrieves prayer times for a specified zone.
 * @param zone The code of the zone in Malaysia.
 * @param year The year. Defaults to the current year.
 * @param month The month. Defaults to the current month (1-indexed).
 * @returns a Solat object that contains the prayer times.
 */
  getPrayerTimeByCode(zone: string = this.zoneSubject.getValue(), year: number = new Date().getFullYear(), month: number = new Date().getMonth() + 1): Observable<Solat> {
    const params = this.getPrayerTimeParams(year, month);
    return this.http.get<Solat>(`${this.api.prayerTimeUri}/${zone}`, { params: params }).pipe(
      catchError((error: HttpErrorResponse): Observable<any> => {
        let errorMessage = 'An unexpected error occurred';
        if (error.status === 404) {
          errorMessage = 'Data not found. The solat data for the given month and year may not be available yet. Please contact the developer.';
        } else if (error.status === 500) {
          errorMessage = 'Error occurred when parsing the provided parameters.';
        }
        this.toastr.error(errorMessage, 'Error');
        return throwError(() => error);
      })
    )
  }

  /**
   * Get the prayer time info by zone code of a specific date
   * @param data a Solat object that contains the zone code and date.
   * @param date a Date object that represent the specific date. Default is today.
   * @returns a Solat object that contains the prayer time on the specific date.
   */
  getPrayerTimeViaDate(data: Solat, date: Date = new Date()): PrayerTime | undefined {
    if (!data) {
      this.toastr.error("Prayer data is empty!");
      return undefined;
    }

    const day = this.dt.splitGregorian(date, 'dd-MM-yyyy', '-')[0];
    return data.prayers.find(prayer => prayer.day == day)!;
  }

  /**
   * Sort the prayer list by the order of the prayer.
   * @param prayerList a list of NextPrayerInfo array.
   * @returns a sorted list of NextPrayerInfo array.
   */
  sortByPrayer(prayerList: NextPrayerInfo[]): NextPrayerInfo[] {
    return prayerList.sort((a, b) => this.prayerNames.indexOf(a.name as PrayerTimeName) - this.prayerNames.indexOf(b.name as PrayerTimeName));
  }

 /**
 * Map the prayer times to the NextPrayerInfo object.
 * @param originData a PrayerTime object that contains the prayer times.
 * @returns a list of NextPrayerInfo object.
 */
  private mapPrayerTimes(originData: PrayerTime): NextPrayerInfo[] {
    const prayerTimes = [
      originData.fajr,
      originData.fajr,
      originData.syuruk,
      originData.dhuhr,
      originData.asr,
      originData.maghrib,
      originData.isha
    ];

    return this.prayerNames.map((name, index) => {
      const time = index == 0 ? this.calcImsakTime(prayerTimes[index]) : this.dt.unixToDate(prayerTimes[index]);
      const inSeconds = this.getDurationInSeconds(time);
      const hijriDate = this.getFormattedHijriDate(originData.hijri);

      return {
        name,
        time,
        inSeconds,
        hijriDate,
        zone: this.zoneSubject.getValue(),
        district: this.districtSubject.getValue()
      };
    });
  }

  /**
   * Get and format hijri date.
   * @param hijriDate todays hijri date.
   * @returns a formatted hijri date.
   */
  private getFormattedHijriDate(hijriDate: string): string {
    const [year, month, day] = this.dt.splitHijri(hijriDate, '-');
    // -1 because it uses 0-based index.
    const monthName = Object.values(IslamicMonth)[month - 1];
    return `${day} ${monthName} ${year}`
  }

  /**
 * Set the parameter for getting prayer time for http request.
 * @param year a number that represent the year.
 * @param month a number that represent the month.
 * @returns a HttpParams object that contains the year and month.
 */
  private getPrayerTimeParams(year?: number, month?: number): HttpParams {
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
  private calcImsakTime(fajrTimestamp: number): Date {
    const fajrTime = this.dt.unixToDate(fajrTimestamp);
    const imsakTime = new Date(fajrTime.getTime() - 10 * 60000);
    return imsakTime;
  }

  /**
  * Sort via the closest upcoming prayer to the current time.
  * @param todayPrayerTimes list of today's prayer times.
  * @returns a sorted prayer times.
  */
  private sortByTime(todayPrayerTimes: NextPrayerInfo[]): NextPrayerInfo[] {
    return todayPrayerTimes.sort((a, b) => a.time.getTime() - b.time.getTime());
  }

  /**
  * Filter upcoming prayer info for today.
  * @param todayPrayerTimes list of today's prayer times.
  * @param currentTime current dateTime.
  * @returns a list of the next upcoming prayer for today.
  */
  private filterUpcomingPrayers(todayPrayerTimes: NextPrayerInfo[], currentTime: Date) {
    return todayPrayerTimes.filter(prayer => {
      return (prayer.time > currentTime) && prayer.name !== PrayerTimeName.imsak && prayer.name !== PrayerTimeName.syuruk;
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

    const tomorrowPrayerTimes = this.getPrayerTimeViaDate(monthlyTimes, tomorrow) as PrayerTime;
    if (!tomorrowPrayerTimes || !tomorrowPrayerTimes.fajr) {
      throw new Error("Failed to retrieve Fajr prayer time for tomorrow.");
    }

    const fajrDatetime = this.dt.unixToDate(tomorrowPrayerTimes.fajr, 1);
    const hijriDate = this.dt.splitHijri(tomorrowPrayerTimes.hijri, '-');
    const islamicMonthArray = Object.values(IslamicMonth);
    const hijriString = `${hijriDate[2]} ${islamicMonthArray[hijriDate[1] - 1]} ${hijriDate[0]}`;

    return {
      name: PrayerTimeName.fajr,
      time: fajrDatetime,
      inSeconds: this.getDurationInSeconds(fajrDatetime),
      hijriDate: hijriString,
      zone: this.zoneSubject.getValue(),
      district: this.districtSubject.getValue(),
    }
  }

  /**
 * Get the duration of the next prayer in seconds.
 * @param targetDate a target date to calculate the duration.
 * @returns a duration in seconds.
 */
  private getDurationInSeconds(targetDate: Date) {
    if (!targetDate || isNaN(targetDate.getTime())) {
      throw new Error("Invalid target date provided.");
    }

    const now = new Date();
    const milliseconds = targetDate.getTime() - now.getTime();
    const seconds = Math.floor(milliseconds / 1000);
    return seconds;
  }
}
