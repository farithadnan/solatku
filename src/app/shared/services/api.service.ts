import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private prayerTimeEndpoint = 'v2/solat';
  private zoneEndpoint = 'zones'

  constructor() {}

/**
 * Get the URI for retrieving prayer time.
 * @returns The URI for waktu solat.
 */
  get prayerTimeUri() {
    return `${environment}/${this.prayerTimeEndpoint}`;
  }

  /**
   * Get the URI for retrieving `zone`.
   * @returns The URI of `zone`.
   */
  get zoneUri() {
    return `${environment}/${this.zoneEndpoint}`;
  }
}
