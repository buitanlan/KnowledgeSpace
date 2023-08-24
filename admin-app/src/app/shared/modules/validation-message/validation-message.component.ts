import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-validation-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="ui-message ui-widget ui-corner-all ui-message-error"
      *ngIf="entityForm.controls[fieldName].invalid && entityForm.controls[fieldName].dirty"
    >
      <div *ngFor="let validation of validationMessages.name">
        <span *ngIf="entityForm.controls[fieldName]?.errors?.[validation.type]">
          <i class="fa fa-close"></i> {{ validation.message }}
        </span>
      </div>
    </div>
  `
})
export class ValidationMessageComponent {
  @Input() entityForm!: FormGroup;
  @Input() fieldName!: string;
  @Input() validationMessages: any;
  constructor() {}

  ngOnInit(): void {}
}
