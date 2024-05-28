import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { NextPrayerInfo } from 'src/app/shared/interfaces/solat.model';
import { SolatService } from 'src/app/shared/services/solat.service';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { TuiDialogService } from '@taiga-ui/core';
import { ZoneSwitcherComponent } from 'src/app/shared/dialogs/zone-switcher/zone-switcher.component';
import { Subject, combineLatest } from 'rxjs';
import { Daerah, GroupZone, Zone } from 'src/app/shared/interfaces/zone.model';
import { ZoneService } from 'src/app/shared/services/zone.service';
import { ToastrService } from 'ngx-toastr';
import { TranslatorService } from 'src/app/shared/services/translator.service';


@Component({
  selector: 'app-next-prayer-info',
  templateUrl: './next-prayer-info.component.html',
  styleUrls: ['./next-prayer-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextPrayerInfoComponent implements OnInit {
  nextPrayer!: NextPrayerInfo;
  zoneData: GroupZone[] = [];
  loading: boolean = false;

  nextPrayerSecondsSubject: Subject<void> = new Subject<void>();

  constructor(@Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
              @Inject(Injector) private readonly injector: Injector,
              private translator: TranslatorService,
              private cdr: ChangeDetectorRef,
              private toastr: ToastrService,
              private zoneApi: ZoneService,
              private solatApi: SolatService) {
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.nextPrayer = await this.solatApi.calcNextPrayer();

    // Fetch the zones data and group them by state.
    this.zoneApi.getZones().subscribe((data: Zone[]) => {
      this.zoneData = this.zoneApi.groupZoneByState(data);
    })

    // Subscribe to the zone and district changes.
    combineLatest([this.solatApi.zone$, this.solatApi.district$]).subscribe(async ([zone, district]) => {
      if (!zone || !district) {
        this.loading = false;
        return;
      }
      this.nextPrayer = await this.solatApi.calcNextPrayer();
    })

    this.nextPrayerSecondsSubject.subscribe(() => {
      window.location.reload();
    });

    this.cdr.detectChanges();
    this.loading = false;
  }

  /**
   * Open the dialog for zone switcher.
   */
  async openDialog() {
    const modalTitle = await this.translator.getTranslation('solatku.info_section.button.change_zone.label');
    this.dialogs.open(
      new PolymorpheusComponent(ZoneSwitcherComponent, this.injector),
      {
        data: this.zoneData,
        size: 'm',
        dismissible: false,
        label: modalTitle,
      }
    ).subscribe({
      next: async data => {
        this.loading = true;
        const result = data as unknown as Daerah;

        if (!result || !result.jakimCode || !result.name) {
          const message = await this.translator.getTranslation('solatku.toastr.info_section.error_msg');
          const title = await this.translator.getTranslation('solatku.toastr.title.error');

          this.toastr.error(message, title);
          this.loading = false;
          return;
        }

        if (result.jakimCode === localStorage.getItem('zone')) {
          this.loading = false;
          return;
        }

        const message = await this.translator.getTranslation('solatku.toastr.info_section.success_msg');
        const title = await this.translator.getTranslation('solatku.toastr.title.success');

        this.solatApi.updateZone(result.jakimCode);
        this.solatApi.updateDistrict(result.name);
        this.loading = false;
        this.toastr.success(message, title);
      }
    })
    this.loading = false;
  }
}
