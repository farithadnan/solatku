import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Daerah, GroupZone } from '../../interfaces/zone.model';
import { ZoneService } from '../../services/zone.service';
import { ToastrService } from 'ngx-toastr';
import { SolatService } from '../../services/solat.service';
import { TranslatorService } from '../../services/translator.service';

@Component({
  selector: 'app-zone-switcher',
  templateUrl: './zone-switcher.component.html',
  styleUrls: ['./zone-switcher.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoneSwitcherComponent implements OnInit{
  value: any | null = null;
  selectSize: 's' | 'm' | 'l' = 'l';

  constructor(private zoneApi: ZoneService,
    private toastr: ToastrService, private translator: TranslatorService,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<Daerah, GroupZone[]>) {}

  get zones(): GroupZone[] {
    return this.context.data;
  }

  ngOnInit(): void {
    this.value = localStorage.getItem('district');
  }

  async submit(): Promise<void> {
    if (this.value !== null) {
      const zone = this.zoneApi.getJakimCode(this.value, this.zones);

      if (zone == '') {
        const title = await this.translator.getTranslation('solatku.toastr.title.error');
        const message = await this.translator.getTranslation('solatku.toastr.zone_switcher_section.error_msg');
        this.toastr.error(message, title);
        return;
      }

      const result: Daerah = {
        jakimCode: zone,
        name: this.value as string
      }

      this.context.completeWith(result);
    }
  }
}
