import { Pipe, PipeTransform } from "@angular/core";
import { DateFilterService } from "../services/date-filter.service";

@Pipe({
  name: 'timeTo12Hrs'
})
export class EpochToDatePipe implements PipeTransform {
  constructor(private dateConversion: DateFilterService) {}

  transform(dateTime: Date) {
    // Get hours, minutes, and seconds
    let hours = dateTime.getHours();
    let minutes = dateTime.getMinutes();

    // Convert hours to 12-hour format and add AM/PM indicator
    let meridiem = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12

    // Format the time with two digits for minutes
    let timeString = hours + ':' + String(minutes).padStart(2, '0') + ' ' + meridiem;
    return timeString;
  }
}
