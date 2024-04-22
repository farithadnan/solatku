import { Component,OnInit } from '@angular/core';
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

  ngOnInit(): void {
    this.solatApi.setLocalStorage();
    this.solatApi.getPrayerTimeByCode(this.chosenZone).subscribe((data: Solat) => {
      this.monthlyData = data;
      this.todayPrayerTimes = this.solatApi.getPrayerTimeViaDate(this.monthlyData);
    });
  }
}
