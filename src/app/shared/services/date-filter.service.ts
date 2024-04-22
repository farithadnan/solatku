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

  /**
   * Convert gregorian date to julian date.
   * @param year a number representing year.
   * @param month a number representing month.
   * @param day a number representing day.
   * @returns a number representing julian date.
   */
  hijriToJulian(year: number, month: number, day: number){
    return (
      Math.floor((11 * year + 3) / 30) +
      Math.floor(354 * year) +
      Math.floor(30 * month) -
      Math.floor((month - 1) / 2) +
      day +
      1948440 -
      386
    );
  };


  /**
   * Convert julian date to gregorian date.
   * @param year a number representing year.
   * @param month a number representing month.
   * @param day a number representing day.
   * @returns a number representing julian date.
   */
  gregorianToJulian(year: number, month: number, day: number) {
    if (month < 3) {
      year -= 1;
      month += 12;
    }

    const a = Math.floor(year / 100.0);
    const b = year === 1582 && (month > 10 || (month === 10 && day > 4))
      ? -10 :
      year === 1582 && month === 10
        ? 0 :
        year < 1583
          ? 0 :
          2 - a + Math.floor(a / 4.0);

    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524;
  }

  /**
   * Convert julian date to hijri date.
   * @param julianDay a number representing julian day.
   * @returns a object representing hijri date.
   */
  julianToHijri(julianDay: number) {
    const y = 10631.0 / 30.0;
    const epochAstro = 1948084;
    const shift1 = 8.01 / 60.0;

    let z = julianDay - epochAstro;
    const cyc = Math.floor(z / 10631.0);
    z -= 10631 * cyc;
    const j = Math.floor((z - shift1) / y);
    z -= Math.floor(j * y + shift1);

    const year = 30 * cyc + j;
    let month = Math.floor((z + 28.5001) / 29.5);
    if (month === 13) {
      month = 12;
    }

    const day = z - Math.floor(29.5001 * month - 29);

    return { year: year, month: month, day: day};
  }

  /**
   * Convert Julian date to Gregorian date.
   * @param julianDate a number representing julian date.
   * @returns a object representing gregorian date.
   */
  julianToGregorian(julianDate: number) {
    let b = 0;
    if (julianDate > 2299160) {
      const a = Math.floor((julianDate - 1867216.25) / 36524.25);
      b = 1 + a - Math.floor(a / 4.0);
    }

    const bb = julianDate + b + 1524;
    let cc = Math.floor((bb - 122.1) / 365.25);
    const dd = Math.floor(365.25 * cc);
    const ee = Math.floor((bb - dd) / 30.6001);

    const day = bb - dd - Math.floor(30.6001 * ee);
    let month = ee - 1;

    if (ee > 13) {
      cc += 1;
      month = ee - 13;
    }

    const year = cc - 4716;
    return { year: year, month: month, day: day };
  }
}

// getMonth() requires to plus 1 why is that: https://stackoverflow.com/questions/15799514/why-does-javascript-getmonth-count-from-0-and-getdate-count-from-1
