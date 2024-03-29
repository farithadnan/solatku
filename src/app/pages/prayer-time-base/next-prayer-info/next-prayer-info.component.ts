import { Component, Input, OnInit } from '@angular/core';
import { SolatService } from 'src/app/shared/services/solat.service';

@Component({
  selector: 'app-next-prayer-info',
  templateUrl: './next-prayer-info.component.html',
  styleUrls: ['./next-prayer-info.component.less']
})
export class NextPrayerInfoComponent implements OnInit {
  @Input() zone!: string;
  @Input() district!: string;

  constructor(private solatApi: SolatService) { }

  async ngOnInit(): Promise<void> {
    const data = await this.solatApi.getPrayerTimeByCode(this.zone);

    console.log(data);
  }

}
