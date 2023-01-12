import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";
import {SettingsService} from "../../services/settings/settings.service";
import {SessionEnd, SessionStart} from "../../types";

@Component({
  selector: 'app-start-end-specs',
  templateUrl: './start-end-specs.component.html',
  styleUrls: ['./start-end-specs.component.css']
})
export class StartEndSpecsComponent implements OnInit {
  formGroupStart!: FormGroup;
  formGroupEnd!: FormGroup;

  constructor(
    private settingsService: SettingsService
  ) {
  }

  ngOnInit(): void {
    //  Redo this - need to try to retrieve from settings first, then do these calculations only
    //  if there is no setting or if it is in the past
    const startValue: SessionStart = this.getStartValue();
    this.formGroupStart = new FormGroup({
      startGroupControl: new FormControl(startValue.immediate ? 'startnow' : 'startlater'),
      startWhenControl: new FormControl({
          value: this.localDateTimeString(startValue.laterDate!),
          disabled: startValue.immediate
        },
        this.minimumDateTimeValidator()),
    });
    this.formGroupStart.valueChanges.subscribe(this.startGroupChanged.bind(this));

    const endValue: SessionEnd = this.getEndValue();
    this.formGroupEnd = new FormGroup({
      endGroupControl: new FormControl(endValue.whenDone ? 'enddone' : 'endlater'),
      endWhenControl: new FormControl({
          value: this.localDateTimeString(endValue.laterDate!),
          disabled: endValue.whenDone
        },
        this.minimumDateTimeValidator()),
    });
    this.formGroupEnd.valueChanges.subscribe(this.endGroupChanged.bind(this));
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

  //  convert the string to a Date object, assuming local time
  private parseDateStringAsLocal(stringToParse: string): Date | null {
    // console.log('parseDateStringAsLocal: ', stringToParse);
    // console.log('   Parsed as: ', parsedDateTime);
    return new Date(stringToParse);
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

  startGroupChanged() {
    if (this.formGroupStart.valid) {
      const immediate = this.formGroupStart.get('startGroupControl')!.value === 'startnow';
      const when = this.parseDateStringAsLocal(this.formGroupStart.get('startWhenControl')!.value);
      this.settingsService.setSessionStart({
        immediate: immediate,
        laterDate: when
      })
    }
  }

  endGroupChanged() {
    if (this.formGroupEnd.valid) {
      const whenDone = this.formGroupEnd.get('endGroupControl')!.value === 'enddone';
      const when = this.parseDateStringAsLocal(this.formGroupEnd.get('endWhenControl')!.value);
      this.settingsService.setSessionEnd({
        whenDone: whenDone,
        laterDate: when
      })
    }
  }

  //  Get the starting setup for the "Start" section.
  //  If values are stored, we try to use them.
  //    If stored Start Time is not in the future, we'll generate a new future date
  //  If no value stored, we'll use now, but preset the start date to a future date
  private getStartValue(): SessionStart {
    let oneHourInFuture = new Date();
    oneHourInFuture.setHours(oneHourInFuture.getHours() + 1);
    let result: SessionStart = {immediate: true, laterDate: oneHourInFuture};
    const storedStartSettings: SessionStart | null = this.settingsService.getSessionStart();
    if (storedStartSettings) {
      const now = new Date();
      result.immediate = storedStartSettings.immediate;
      if (storedStartSettings.laterDate) {
        const parsedLaterDate = new Date(storedStartSettings.laterDate);
        if (parsedLaterDate > now) {
          result.laterDate = parsedLaterDate;
        } else {
          result.laterDate = oneHourInFuture;
        }
      } else {
        result.laterDate = oneHourInFuture;
      }
    }
    return result;
  }

  private getEndValue(): SessionEnd {
    let oneHourInFuture = new Date();
    oneHourInFuture.setHours(oneHourInFuture.getHours() + 1);
    let result: SessionEnd = {whenDone: true, laterDate: oneHourInFuture};
    const storedEndSettings = this.settingsService.getSessionEnd();
    if (storedEndSettings) {
      const now = new Date();
      result.whenDone = storedEndSettings.whenDone;
      if (storedEndSettings.laterDate) {
        const parsedLaterDate = new Date(storedEndSettings.laterDate);
        if (parsedLaterDate > now) {
          result.laterDate = parsedLaterDate;
        } else {
          result.laterDate = oneHourInFuture;
        }
      } else {
        result.laterDate = oneHourInFuture;
      }
    }
    return result;
  }
}
