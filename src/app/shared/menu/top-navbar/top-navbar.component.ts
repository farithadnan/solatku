import { Component, OnInit } from '@angular/core';
import { TranslatorService } from '../../services/translator.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.less']
})
export class TopNavbarComponent implements OnInit{
  open: boolean = false;

  constructor(private translator: TranslatorService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  changeLanguage(event: any) {
    const selectedLanguage = event.target.value;
    this.translator.changeLanguage(selectedLanguage);

    const title = this.translator.getTranslation('solatku.toastr.title.success');
    const message = this.translator.getTranslation('solatku.toastr.zone_switcher_section.language_change_success_msg');
    this.toastr.success(message, title);
  }

  changeTheme() {

  }
}
