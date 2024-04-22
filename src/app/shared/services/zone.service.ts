import { Injectable } from "@angular/core";
import { Zone } from "../interfaces/zone.model";
import { Observable, catchError, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ApiService } from "./api.service";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  constructor(private api: ApiService,
              private toastr: ToastrService,
              private http: HttpClient) {}

  /**
   * Get specific zone or all zones information.
   * @param zoneCode [optional] The zone code to get the zone information.
   * @returns a promise of the zone information.
   */
  getZones(zoneCode?: string): Observable<Zone>{
    const url = zoneCode ? `${this.api.zoneUri}/${zoneCode}` : this.api.zoneUri;
    return this.http.get<Zone>(url).pipe(
      catchError((error: HttpErrorResponse): Observable<any> => {
        if (error.status === 404) {
          this.toastr.error('Provided zone code doesn\'t exist');
        } else if (error.status === 500) {
          this.toastr.error('Internal server error. An error occured while processing your request');
        } else {
          this.toastr.error('An unexpected error occurred');
        }
        return throwError(() => error);
      })
    );
  }
}
