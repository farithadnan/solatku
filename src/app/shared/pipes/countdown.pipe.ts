import { Pipe, PipeTransform } from "@angular/core";
import { Observable, Subject, map, mergeMap, takeWhile, timer } from "rxjs";
import { TranslatorService } from "../services/translator.service";

@Pipe({
  name: 'countdown'
})
export class CountdownPipe implements PipeTransform {
  constructor(private translator: TranslatorService) {}
  transform(duration: number, completionEmitter: Subject<void>): Observable<string> {
    return timer(0, 1000).pipe(
      map((value) => duration - value),
      takeWhile((value) => value >= 0),
      mergeMap(async (value) => {
        if (value === 0) {
          completionEmitter.next();
        }

        const timeParts = this.getTimeParts(value);
        const translations = await this.getTranslations(timeParts);
        return this.formatTime(timeParts, translations);
      })
    )
  }

  private getTimeParts(value: number): { hours: number, minutes: number, seconds: number } {
    return {
      hours: Math.floor(value / 3600),
      minutes: Math.floor((value % 3600) / 60),
      seconds: value % 60
    };
  }

  private async getTranslations(timeParts: { hours: number, minutes: number, seconds: number }): Promise<{ hoursText: string; minutesText: string; secondsText: string; remainingText: string; }> {
    const hoursTextKey = timeParts.hours <= 1 ? 'hour_singular' : 'hour';
    const minutesTextKey = timeParts.minutes <= 1 ? 'minute_singular' : 'minute';
    const secondsTextKey = timeParts.seconds <= 1 ? 'second_singular' : 'second';

    return {
      hoursText: await this.translator.getTranslation(`solatku.info_section.countdown.${hoursTextKey}`),
      minutesText: await this.translator.getTranslation(`solatku.info_section.countdown.${minutesTextKey}`),
      secondsText: await this.translator.getTranslation(`solatku.info_section.countdown.${secondsTextKey}`),
      remainingText: await this.translator.getTranslation('solatku.info_section.countdown.remaining')
    };
  }

  private formatTime(timeParts: { hours: number, minutes: number, seconds: number }, translations: { hoursText: string, minutesText: string, secondsText: string, remainingText: string }): string {
    const { hours, minutes, seconds } = timeParts;
    const { hoursText, minutesText, secondsText, remainingText } = translations;

    if (hours > 0) {
      return `${hours} ${hoursText} ${minutes} ${minutesText} ${seconds} ${secondsText} ${remainingText}`;
    } else if (minutes > 0) {
      return `${minutes} ${minutesText} ${seconds} ${secondsText} ${remainingText}`;
    } else {
      return `${seconds} ${secondsText} ${remainingText}`;
    }
  }
}
