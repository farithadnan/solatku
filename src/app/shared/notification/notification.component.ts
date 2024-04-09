import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.less']
})
export class NotificationComponent {
  @Input() status: 'neutral' | 'info' | 'success' | 'warning' | 'error' = 'neutral';
  @Input() size: 's' | 'm' | 'l' = 'm';
  @Input() title: string = 'Notifikasi';
  @Input() message: string = 'Ini adalah notifikasi.';
}
