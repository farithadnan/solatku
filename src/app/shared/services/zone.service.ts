import { Injectable } from "@angular/core";
import { GroupZone, Zone, Daerah } from "../interfaces/zone.model";
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
  getZones(zoneCode?: string): Observable<Zone[]>{
    const url = zoneCode ? `${this.api.zoneUri}/${zoneCode}` : this.api.zoneUri;
    return this.http.get<Zone[]>(url).pipe(
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

  /**
   * Group the zones by state.
   * @param zones a list of zones to group by state.
   * @returns a list of grouped zones by state.
   */
  groupZoneByState(zones: Zone[]): GroupZone[] {
    const groupedData: { [key: string]: Daerah[] } = {};
    zones.forEach(zone => {
      if (!groupedData[zone.negeri]) {
        groupedData[zone.negeri] = [];
      }
      groupedData[zone.negeri].push({ jakimCode: zone.jakimCode, name: zone.daerah });
    });

    return Object.entries(groupedData).map(([negeri, values]) => ({
      negeri,
      data: values,
    }));
  }

  /**
   * Get the JAKIM code for the district.
   * @param district the district name to get the JAKIM code.
   * @param zones a list of zones to get the JAKIM code.
   * @returns the JAKIM code for the district.
   */
  getJakimCode(district: string, zones: GroupZone[]): string {
    let jakimCode = '';
    zones.forEach(zone => {
      zone.data.forEach(daerah => {
        if (daerah.name === district) {
          jakimCode = daerah.jakimCode;
        }
      });
    });
    return jakimCode;
  }
}
