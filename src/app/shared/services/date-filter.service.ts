import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { toGregorian, toHijri } from "hijri-converter";

@Injectable({
  providedIn: 'root'
})
export class DateFilterService {

  constructor(private datePipe: DatePipe) {}

  /**
   * Convert unix timestamp (epoch) to Date().
   * @param timestamp unix timestamp/epoch.
   * @returns a Date() format.
   */
  unixToDate(timestamp: number, daysToAdd: number = 0): Date {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const newDate = new Date();
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(seconds);

    if (daysToAdd > 0) {
      newDate.setDate(newDate.getDate() + daysToAdd);
    }

    return newDate;
  }

  /**
   * Split gregorian date with specific format.
   * @param date a gregorian date.
   * @param dateFormat a final format of the date.
   * @param splitter a substring for separator.
   * @returns number[] representing splitted date.
   */
  splitGregorian(date: Date, dateFormat: string, splitter: string) {
    return this.datePipe.transform(date, dateFormat)!.split(splitter).map(Number);
  }

  /**
   * Split hijri date with specific seperator.
   * @param hijriDate a hijri date.
   * @param splitter a substring for separator.
   * @returns number[] representing splitted date.
   */
  splitHijri(hijriDate: string, splitter: string) {
    return hijriDate.split(splitter).map(Number);
  }

}

// getMonth() requires to plus 1 why is that: https://stackoverflow.com/questions/15799514/why-does-javascript-getmonth-count-from-0-and-getdate-count-from-1
