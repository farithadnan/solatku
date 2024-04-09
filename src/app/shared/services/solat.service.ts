import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http"

import { Observable, lastValueFrom } from "rxjs";
import { ToastrService } from "ngx-toastr";

import { ApiService } from "./api.service";
import { Zone } from "../interfaces/zone.model";
import { NextPrayerInfo, PrayerTime, Solat } from "../interfaces/solat.model";
import { DateFilterService } from "./date-filter.service";

@Injectable({
  providedIn: 'root'
})
export class SolatService {
  constructor(private api: ApiService,
              private toastr: ToastrService,
              private dateFilter: DateFilterService,
              private http: HttpClient) {}

  /**
 * Retrieves prayer times for a specified zone.
 * @param zone The code of the zone in Malaysia.
 * @param year The year. Defaults to the current year.
 * @param month The month. Defaults to the current month (1-indexed).
 * @returns An Observable emitting prayer times for the specified zone.
 */
  getPrayerTimeByCode(zone: string, year: number = new Date().getFullYear(), month: number = new Date().getMonth() + 1): Observable<Solat> {
    const params = this.getPrayerTimeParams(year, month);
    return this.http.get<Solat>(`${this.api.prayerTimeUri}/${zone}`, { params: params });
  }

  /**
   * Get the prayer time info by zone code of a specific date.
   * @param data a Solat object that contains the zone code and date.
   * @returns a Solat object that contains the prayer time on the specific date.
   */
  getPrayerTimeViaDate(data: Solat, date: Date = new Date()): PrayerTime {
    if (!data) {
      this.toastr.error("Data prayer is empty!");
      throw new Error('Data is empty');
    }

    let prayerTime!: PrayerTime;
    const day = this.dateFilter.splitGregorian(date, 'dd-MM-yyyy', '-')[0];

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
}
