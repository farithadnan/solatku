import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http"
import { ApiService } from "./api.service";
import { Solat } from "../interfaces/solat.model";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SolatService {
  constructor(private api: ApiService, private http: HttpClient) {}

  getPrayerTimeByCode(zone: string): Promise<Solat> {
    return await lastValueFrom(this.http.)
  }

  getPrayerTimeByGps() {

  }

  getAllZone() {}

  getZoneByCode() {

  }

  getZoneByGps() {

  }
}
