import { Component, EventEmitter, inject } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ValidationMessageComponent } from '@app/shared/modules/validation-message/validation-message.component';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageConstants } from '@app/protected-zone/systems/constants';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UsersService } from '@app/shared/services/users.service';
import { DatePipe } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-users-detail',
  template: `
    <!--Modal add and edit-->
    <div class="modal-header">
      <h4 class="modal-title pull-left">{{ dialogTitle }}</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <form class="form-horizontal form-label-left" novalidate [formGroup]="entityForm" (ngSubmit)="saveChange()">
      <div class="modal-body div-scroll">
        <p-panel #pnl header="Thông tin" [toggleable]="true" [collapsed]="false">
          <div class="ui-grid ui-grid-responsive ui-grid-pad ui-fluid">
            <div class="ui-grid-row">
              <div class="ui-grid-col-2">
                <span class="required">Tài khoản:</span>
              </div>
              <div class="ui-grid-col-6">
                <input type="text" pInputText [pKeyFilter]="noSpecial" formControlName="userName" />
              </div>
              <div class="ui-grid-col-4">
                <app-validation-message
                  [entityForm]="entityForm"
                  fieldName="userName"
                  [validationMessages]="validation_messages"
                ></app-validation-message>
              </div>
            </div>
            <div class="ui-grid-row">
              <div class="ui-grid-col-2">
                <span class="required">Mật khẩu:</span>
              </div>
              <div class="ui-grid-col-6">
                <input type="password" pInputText formControlName="password" />
              </div>
              <div class="ui-grid-col-4">
                <app-validation-message
                  [entityForm]="entityForm"
                  fieldName="password"
                  [validationMessages]="validation_messages"
                ></app-validation-message>
              </div>
            </div>
            <div class="ui-grid-row">
              <div class="ui-grid-col-2">
                <span class="required">Tên:</span>
              </div>
              <div class="ui-grid-col-6">
                <input type="text" pInputText [pKeyFilter]="noSpecial" formControlName="firstName" />
              </div>
              <div class="ui-grid-col-4">
                <app-validation-message
                  [entityForm]="entityForm"
                  fieldName="firstName"
                  [validationMessages]="validation_messages"
                ></app-validation-message>
              </div>
            </div>
            <div class="ui-grid-row">
              <div class="ui-grid-col-2">
                <span class="required">Họ:</span>
              </div>
              <div class="ui-grid-col-6">
                <input type="text" pInputText [pKeyFilter]="noSpecial" formControlName="lastName" />
              </div>
              <div class="ui-grid-col-4">
                <app-validation-message
                  [entityForm]="entityForm"
                  fieldName="lastName"
                  [validationMessages]="validation_messages"
                ></app-validation-message>
              </div>
            </div>
            <div class="ui-grid-row">
              <div class="ui-grid-col-2">
                <span>Ngày sinh:</span>
              </div>
              <div class="ui-grid-col-6">
                <p-calendar
                  formControlName="dob"
                  dateFormat="dd/mm/yy"
                  [showIcon]="true"
                  [locale]="vi"
                  [monthNavigator]="true"
                  [yearNavigator]="true"
                  yearRange="1900:2030"
                  [showButtonBar]="true"
                >
                </p-calendar>
              </div>
            </div>

            <div class="ui-grid-row">
              <div class="ui-grid-col-2">
                <span class="required">Email:</span>
              </div>
              <div class="ui-grid-col-6">
                <input type="text" pInputText pKeyFilter="email" formControlName="email" />
              </div>
              <div class="ui-grid-col-4">
                <app-validation-message
                  [entityForm]="entityForm"
                  fieldName="email"
                  [validationMessages]="validation_messages"
                ></app-validation-message>
              </div>
            </div>
            <div class="ui-grid-row">
              <div class="ui-grid-col-2">
                <span>Điện thoại:</span>
              </div>
              <div class="ui-grid-col-6">
                <input type="text" pInputText pKeyFilter="int" formControlName="phoneNumber" />
              </div>
            </div>
          </div>
          <p-blockUI [target]="pnl" [blocked]="blockedPanel">
            <p-progressSpinner
              [style]="{ width: '100px', height: '100px', position: 'absolute', top: '25%', left: '50%' }"
              strokeWidth="2"
              animationDuration=".5s"
            ></p-progressSpinner>
          </p-blockUI>
        </p-panel>
      </div>
      <div class="modal-footer">
        <button type="submit" pButton class="btn btn-primary" [disabled]="!entityForm.valid || btnDisabled">
          Lưu lại
        </button>
        &nbsp;
        <button type="button" pButton class="btn btn-default" (click)="bsModalRef.hide()">Đóng</button>
      </div>
    </form>
  `,
  imports: [
    PanelModule,
    ValidationMessageComponent,
    KeyFilterModule,
    InputTextModule,
    ReactiveFormsModule,
    CalendarModule,
    BlockUIModule,
    ProgressSpinnerModule,
    ConfirmDialogModule,
    MessageModule
  ],
  standalone: true
})
export class UsersDetailComponent {
  public bsModalRef = inject(BsModalRef);
  private usersService = inject(UsersService);
  private fb = inject(FormBuilder);
  private datePipe = inject(DatePipe);
  private confirmDialog = inject(ConfirmationService);
  private messageService = inject(MessageService);

  public blockedPanel = false;
  public myRoles: string[] = [];
  public entityForm!: FormGroup;
  public dialogTitle!: string;
  public entityId!: string;

  public btnDisabled = false;
  public saveBtnName!: string;
  public closeBtnName!: string;
  public vi: any;
  saved: EventEmitter<any> = new EventEmitter();

  // Validate
  noSpecial: RegExp = /^[^<>*!_~]+$/;
  validation_messages = {
    firstName: [
      { type: 'required', message: 'Bạn phải nhập tên người dùng' },
      { type: 'minlength', message: 'Bạn phải nhập ít nhất 3 kí tự' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 255 kí tự' }
    ],
    lastName: [
      { type: 'required', message: 'Bạn phải nhập tên người dùng' },
      { type: 'minlength', message: 'Bạn phải nhập ít nhất 3 kí tự' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 255 kí tự' }
    ],
    userName: [
      { type: 'required', message: 'Bạn phải nhập tên tài khoản' },
      { type: 'minlength', message: 'Bạn phải nhập ít nhất 3 kí tự' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 255 kí tự' }
    ],
    password: [
      { type: 'required', message: 'Bạn phải nhập tên tài khoản' },
      { type: 'minlength', message: 'Bạn phải nhập ít nhất 6 kí tự' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 255 kí tự' },
      { type: 'pattern', message: 'Mật khẩu không đủ độ phức tạp' }
    ],
    email: [
      { type: 'required', message: 'Bạn phải nhập email' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 255 kí tự' },
      { type: 'pattern', message: 'Bạn phải nhập đúng định dạng Email' }
    ]
  };

  ngOnInit() {
    this.entityForm = this.fb.group({
      id: new FormControl(''),
      firstName: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(255), Validators.minLength(3)])
      ),
      lastName: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(255), Validators.minLength(3)])
      ),
      userName: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.maxLength(255), Validators.minLength(3)])
      ),
      password: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(255),
          Validators.minLength(8),
          Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')
        ])
      ),
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])
      ),
      phoneNumber: new FormControl(),
      dob: new FormControl()
    });
    if (this.entityId) {
      this.loadUserDetail(this.entityId);
      this.dialogTitle = 'Cập nhật';
      this.entityForm.controls['userName'].disable({ onlySelf: true });
      this.entityForm.controls['password'].disable({ onlySelf: true });
    } else {
      this.dialogTitle = 'Thêm mới';
    }

    this.vi = {
      firstDayOfWeek: 0,
      dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      today: 'Today',
      clear: 'Clear'
    };
  }

  loadUserDetail(id: any) {
    this.btnDisabled = true;
    this.blockedPanel = true;
    this.usersService.getDetail(id).subscribe(
      (response: any) => {
        const dob: Date = new Date(response.dob);
        this.entityForm.setValue({
          id: response.id,
          firstName: response.firstName,
          lastName: response.lastName,
          userName: response.userName,
          email: response.email,
          password: '',
          phoneNumber: response.phoneNumber,
          dob: dob
        });
        setTimeout(() => {
          this.btnDisabled = false;
          this.blockedPanel = false;
        }, 1000);
      },
      () => {
        setTimeout(() => {
          this.btnDisabled = false;
          this.blockedPanel = false;
        }, 1000);
      }
    );
  }

  saveChange() {
    this.btnDisabled = true;
    this.blockedPanel = true;
    const rawValues = this.entityForm.getRawValue();
    rawValues.dob = this.datePipe.transform(this.entityForm.controls['dob'].value, 'MM/dd/yyyy');
    if (this.entityId) {
      this.usersService.update(this.entityId, rawValues).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Service Message',
            detail: MessageConstants.UPDATED_OK_MSG
          });

          setTimeout(() => {
            this.btnDisabled = false;
            this.blockedPanel = false;
          }, 1000);
          this.saved.emit(this.entityForm.value);
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Service Message', detail: error });

          setTimeout(() => {
            this.btnDisabled = false;
            this.blockedPanel = false;
          }, 1000);
        }
      );
    } else {
      this.usersService.add(rawValues).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Service Message',
            detail: MessageConstants.CREATED_OK_MSG
          });

          this.saved.emit(this.entityForm.value);

          setTimeout(() => {
            this.btnDisabled = false;
            this.blockedPanel = false;
          }, 1000);
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Service Message', detail: error });

          setTimeout(() => {
            this.btnDisabled = false;
            this.blockedPanel = false;
          }, 1000);
        }
      );
    }
  }
}
