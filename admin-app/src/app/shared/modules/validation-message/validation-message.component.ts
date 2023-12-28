import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-validation-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (entityForm.controls[fieldName].invalid && entityForm.controls[fieldName].dirty) {
      <div class="ui-message ui-widget ui-corner-all ui-message-error">
        @for (validation of validationMessages[fieldName]; track validation) {
          <div>
            @if (entityForm.controls[fieldName]?.errors?.[validation.type]) {
              <span> <i class="fa fa-close"></i> {{ validation.message }} </span>
            }
          </div>
        }
      </div>
    }
  `
})
export class ValidationMessageComponent {
  @Input() entityForm!: FormGroup;
  @Input() fieldName!: string;
  @Input() validationMessages: any[];
  constructor() {}

  ngOnInit(): void {}
}
