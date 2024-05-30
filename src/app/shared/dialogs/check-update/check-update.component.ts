import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-check-update',
  templateUrl: './check-update.component.html',
  styleUrls: ['./check-update.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class checkUpdateComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }
}
