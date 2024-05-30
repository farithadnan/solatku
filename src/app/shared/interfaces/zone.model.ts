export interface Zone {
  jakimCode: string,
  negeri: string,
  daerah: string
}

export interface GroupZone {
  negeri: string,
  data: Daerah[],
}

export interface Daerah {
  jakimCode: string,
  name: string,
}
