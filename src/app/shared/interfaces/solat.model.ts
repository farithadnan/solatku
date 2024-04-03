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
  fajr: number,
  syuruk: number,
  dhuhr: number,
  asr: number,
  maghrib: number,
  isha: number,
}


export interface NextPrayerInfo {
  name: string,
  time: Date
}
