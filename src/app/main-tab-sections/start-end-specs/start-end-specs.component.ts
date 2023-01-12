import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";

@Component({
  selector: 'app-start-end-specs',
  templateUrl: './start-end-specs.component.html',
  styleUrls: ['./start-end-specs.component.css']
})
export class StartEndSpecsComponent implements OnInit {
  formGroupStart!: FormGroup;
  formGroupEnd!: FormGroup;

  constructor(
  ) { }

  ngOnInit(): void {
    //  Redo this - need to try to retrieve from settings first, then do these calculations only
    //  if there is no setting or if it is in the past
    let oneHourInFuture = new Date();
    oneHourInFuture.setHours(oneHourInFuture.getHours() + 1);
    const oneHourInFutureAsString = this.localDateTimeString(oneHourInFuture);
    this.formGroupStart = new FormGroup({
      startGroupControl: new FormControl('startnow'),
      startWhenControl: new FormControl({
          value: oneHourInFutureAsString,
        disabled: true},
        this.minimumDateTimeValidator()),
    });
    this.formGroupEnd = new FormGroup({
      endGroupControl: new FormControl('enddone'),
      endWhenControl: new FormControl(
        {
          value: oneHourInFutureAsString,
          disabled: true},
        this.minimumDateTimeValidator()),
    });
  }

  //  Return the date and time, converted to local time, in the form yyyy-mm-ddThh:mm
  localDateTimeString(dateUTC: Date): string {
    const localYear = dateUTC.getFullYear();
    const localMonth = dateUTC.getMonth() + 1;
    const localDay = dateUTC.getDate();
    const localHour = dateUTC.getHours();
    const localMinute = dateUTC.getMinutes();
    // console.log(`localYear ${localYear}, localMonth ${localMonth}, localDay ${localDay}`);
    // console.log(`localHour ${localHour}, localMinute ${localMinute}`);
    return String(localYear) +
      '-' + String(localMonth).padStart(2, '0') +
      '-' + String(localDay).padStart(2, '0') +
      'T' + String(localHour).padStart(2, '0') +
      ':' + String(localMinute).padStart(2, '0');
  }

  private minimumDateTimeValidator(): ValidatorFn {
    return (control: any) => {
      // console.log('minimumDateTimeValidator. control value = ', control.value);
      const localDate: Date | null = this.parseDateStringAsLocal(control.value);
      // console.log('  Parsed proposed datetime as: ', localDate);
      let result: ValidationErrors | null = null;
      if (!localDate) {
        result = {invalidDate: {}};
      } else if (localDate < new Date()) {
        result = {minimumDateTime: {}};
      }
      return result;
    }
  }

  private parseDateStringAsLocal(stringToParse: string): Date | null {
    // console.log('parseDateStringAsLocal: ', stringToParse);
    // console.log('   Parsed as: ', parsedDateTime);
    return new Date(stringToParse);
  }

  //  Highly targetd set of enabled or disabled for a control, called from the html
  setEnabled(controlGroupName: string, controlName: string, enabled: boolean) {
    const group: FormGroup = controlGroupName === 'startGroupControl' ?
      this.formGroupStart : this.formGroupEnd;
    const control = group.get(controlName);
    if (enabled) {
      control!.enable();
    } else {
      control!.disable();
    }
  }
}
