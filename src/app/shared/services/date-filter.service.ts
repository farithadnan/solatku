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
  epochToJsDate(timestamp: number): Date {
    const milliseconds = timestamp * 1000;
    return new Date(milliseconds);
  }

  /**
   * Convert hijri date to gregorian.
   * @param hijriDate a string representing hijri date.
   * @param splitter a substring for separator.
   * @returns a [year, month, day] array of gregorian date.
   */
  toGregorianDate(hijriDate: string, splitter: string) {
    const [year, month, day] = this.splitHijri(hijriDate, splitter);
    return toGregorian(year, month, day);
  }

/**
 * Convert gregorian date to hijri.
 * @param date a date() format.
 * @param splitter a substring for separator.
 * @returns a [year, month, day] array of hijri date.
 */
  toHijriDate(date: Date, dateFormat: string, splitter: string) {
    const [year, month, day] = this.datePipe.transform(date, dateFormat)!
      .split(splitter)
      .map(Number);
    return toHijri(year, month, day);
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
