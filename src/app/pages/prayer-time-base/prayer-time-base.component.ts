import { Component, Input, OnInit } from '@angular/core';
import { SolatService } from 'src/app/shared/services/solat.service';

@Component({
  selector: 'app-prayer-time-base',
  templateUrl: './prayer-time-base.component.html',
  styleUrls: ['./prayer-time-base.component.less']
})
export class PrayerTimeBaseComponent implements OnInit {
  chosenZone: string = 'WLY01';
  chosenDist: string = 'Kuala Lumpur';

  constructor(private solatApi: SolatService) {}

  ngOnInit(): void {
    this.checkLocalStorage();
  }

  /**
   * Check the local storage for the chosen zone and district.
   */
  checkLocalStorage() {
    if (localStorage.getItem('zone')) {
      this.chosenZone = localStorage.getItem('zone')!;
    }

    if (localStorage.getItem('district')) {
      this.chosenDist = localStorage.getItem('district')!;
    }
  }
}
