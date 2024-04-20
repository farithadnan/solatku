import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PrayerTime, Solat } from 'src/app/shared/interfaces/solat.model';
import { SolatService } from 'src/app/shared/services/solat.service';

@Component({
  selector: 'app-prayer-time-base',
  templateUrl: './prayer-time-base.component.html',
  styleUrls: ['./prayer-time-base.component.less']
})
export class PrayerTimeBaseComponent implements OnInit {
  chosenZone: string = 'WLY01';
  chosenDist: string = 'Kuala Lumpur';
  monthlyData!: Solat;
  todayPrayerTimes!: PrayerTime;

  errorTitle: string = 'Ralat';
  errorMessage: string = 'Maaf, data waktu solat tidak tersedia. Sila cuba sebentar lagi.'

  constructor(private solatApi: SolatService, private toastr: ToastrService) {}

  async ngOnInit(): Promise<void> {
    this.checkLocalStorage();
    this.monthlyData = await this.solatApi.getPrayerTimeByCode(this.chosenZone);
    this.todayPrayerTimes = this.solatApi.getPrayerTimeViaDate(this.monthlyData);
  }

  /**
   * Check the local storage for the chosen zone and district.
   */
  checkLocalStorage() {
    if (localStorage.getItem('zone')) {
      this.chosenZone = localStorage.getItem('zone')!;
    } else {
      localStorage.setItem('zone', this.chosenZone);
    }

    if (localStorage.getItem('district')) {
      this.chosenDist = localStorage.getItem('district')!;
    } else {
      localStorage.setItem('district', this.chosenDist);
    }
  }
}
