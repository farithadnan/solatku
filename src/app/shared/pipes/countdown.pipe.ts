import { Pipe, PipeTransform } from "@angular/core";
import { Observable, Subject, map, takeWhile, timer } from "rxjs";

@Pipe({
  name: 'countdown'
})
export class CountdownPipe implements PipeTransform {
  transform(duration: number): Observable<string> {
    return timer(0, 1000).pipe(
      map((value) => duration - value),
      takeWhile((value) => value >= 0),
      map((value) => {
        const hours = Math.floor(value / 3600);
        const minutes = Math.floor((value % 3600) / 60);
        const seconds = value % 60;

        if (hours > 0) {
          return `${hours} jam ${minutes} minit ${seconds} saat lagi`;
        } else if (minutes > 0) {
          return `${minutes} minit ${seconds} saat lagi`;
        } else {
          return `${seconds} saat lagi`;
        }
      })
    )
  }
}
