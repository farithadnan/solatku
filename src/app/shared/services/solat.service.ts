import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http"

import { lastValueFrom } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { toGregorian, toHijri } from "hijri-converter";

import { ApiService } from "./api.service";
import { Zone } from "../interfaces/zone.model";
import { Solat } from "../interfaces/solat.model";


@Injectable({
  providedIn: 'root'
})
export class SolatService {
  constructor(private api: ApiService,
              private toastr: ToastrService,
              private http: HttpClient) {}

  /**
   * Get the prayer time info by zone code of current month.
   * @param zone a string that represent the zone code in Malaysia.
   * @param year [optional] a number that represent the year. Default is the current year.
   * @param month [optional] a number that represent the month. Default is the current month.
   * @returns a Solat object that contains the prayer time for the zone.
  */
  async getPrayerTimeByCode(zone: string, year?: number, month?: number): Promise<Solat> {
    try {
      const params = this.getPrayerTimeParams(year, month);
      return await lastValueFrom(this.http.get<Solat>(`${this.api.prayerTimeUri}/${zone}`, { params: params }));
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
   * Get the prayer time info by zone code of a specific date.
   * @param data a Solat object that contains the zone code and date.
   * @returns a Solat object that contains the prayer time on the specific date.
   */
  getPrayerTimeViaDate(data: Solat) {
    if (!data) {
      this.toastr.error('Data is empty');
      return;
    }

    data.prayers.forEach(prayer => {
      const hijriDate = prayer.hijri;
    });

  }

  getAllZone() {}

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
