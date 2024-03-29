export interface Solat {
  zone: string,
  year: number,
  month: string,
  lastUpdated: Date,
  prayers: PrayerTime[],

}

export interface PrayerTime {
  hijri: string,
  day: number,
  fajr: Date,
  syuruk: Date,
  dhuhr: Date,
  asr: Date,
  maghrib: Date,
  isha: Date,
}
