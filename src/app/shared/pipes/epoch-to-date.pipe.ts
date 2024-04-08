import { Pipe, PipeTransform } from "@angular/core";
import { DateFilterService } from "../services/date-filter.service";

@Pipe({
  name: 'epochTo12Hrs'
})
export class EpochToDatePipe implements PipeTransform {
  constructor(private dateConversion: DateFilterService) {}

  transform(timestamp: number) {
    const date = this.dateConversion.epochToJsDate(timestamp);
    // Get hours, minutes, and seconds
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // Convert hours to 12-hour format and add AM/PM indicator
    let meridiem = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12

    // Format the time
    let timeString = hours + ':' + minutes + ' ' + meridiem;
    return timeString;
  }
}
