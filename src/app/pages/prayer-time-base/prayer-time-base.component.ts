import { Component,OnInit, ViewEncapsulation } from '@angular/core';
import { PrayerTime, Solat } from 'src/app/shared/interfaces/solat.model';
import { SolatService } from 'src/app/shared/services/solat.service';

@Component({
  selector: 'app-prayer-time-base',
  templateUrl: './prayer-time-base.component.html',
  styleUrls: ['./prayer-time-base.component.less'],
})
export class PrayerTimeBaseComponent implements OnInit {
  monthlyData!: Solat;
  todayPrayerTimes!: PrayerTime;
  loading: boolean = false;

  constructor(private solatApi: SolatService) {}

  ngOnInit(): void {
    this.loading = true;

    this.solatApi.initStorage();
    this.solatApi.getPrayerTimeByCode().subscribe((data: Solat) => {
      this.monthlyData = data;
      this.todayPrayerTimes = this.solatApi.getPrayerTimeViaDate(this.monthlyData) as PrayerTime;
      this.loading = false;
    });
  }
}
