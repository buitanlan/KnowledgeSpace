import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Panel } from 'primeng/panel';
import { ValidationMessageComponent } from '@app/shared/modules/validation-message/validation-message.component';
import { DropdownModule } from 'primeng/dropdown';
import { KeyFilter } from 'primeng/keyfilter';
import { InputText } from 'primeng/inputtext';
import { ProgressSpinner } from 'primeng/progressspinner';
import { BlockUI } from 'primeng/blockui';
import { MessageConstants } from '@app/protected-zone/systems/constants/messages.constant';
import { NotificationService } from '@app/shared/services/notification.service';
import { FunctionsService } from '@app/shared/services/functions.service';

@Component({
  selector: 'app-functions-detail',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">{{ dialogTitle }}</h4>
      <button type="button" class="close pull-right" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <form class="form-horizontal form-label-left" novalidate [formGroup]="entityForm" (ngSubmit)="saveChange()">
      <div class="modal-body div-scroll">
        <p-panel #pnl header="Thông tin" [toggleable]="true" [collapsed]="false" styleClass="m-b-10">
          <div class="ui-grid ui-grid-responsive ui-grid-pad ui-fluid">
            <div class="ui-grid-row">
              <div class="ui-grid-col-2">
                <span class="required">Mã duy nhất:</span>
              </div>
              <div class="ui-grid-col-6">
                <input type="text" pInputText formControlName="id">
              </div>
              <div class="ui-grid-col-4">
                <app-validation-message [entityForm]="entityForm" fieldName="id"
                                        [validationMessages]="validation_messages"></app-validation-message>
              </div>
            </div>

            <div class="ui-grid-row">
              <div class="ui-grid-col-2">
                <span>Chọn cấp cha:</span>
              </div>
              <div class="ui-grid-col-6">

                <p-dropdown [options]="rootFunctions" emptyFilterMessage="Không có dữ liệu"
                            [style]="{'width':'100%'}" formControlName="parentId" placeholder="Chọn cấp cha"
                            filter="true" [showClear]="true">
                </p-dropdown>
              </div>
              <div class="ui-grid-col-4">
                <app-validation-message [entityForm]="entityForm" fieldName="parentId"
                                        [validationMessages]="validation_messages"></app-validation-message>
              </div>
            </div>

            <div class="ui-grid-row">
              <div class="ui-grid-col-2">
                <span class="required">Tên:</span>
              </div>
              <div class="ui-grid-col-6">
                <input type="text" pInputText [pKeyFilter]="noSpecial" formControlName="name">
              </div>
              <div class="ui-grid-col-4">
                <app-validation-message [entityForm]="entityForm" fieldName="name"
                                        [validationMessages]="validation_messages"></app-validation-message>
              </div>
            </div>


            <div class="ui-grid-row">
              <div class="ui-grid-col-2">
                <span class="required">Url:</span>
              </div>
              <div class="ui-grid-col-6">
                <input type="text" pInputText [pKeyFilter]="noSpecial" formControlName="url">
              </div>
              <div class="ui-grid-col-4">
                <app-validation-message [entityForm]="entityForm" fieldName="url"
                                        [validationMessages]="validation_messages"></app-validation-message>
              </div>
            </div>

            <div class="ui-grid-row">
              <div class="ui-grid-col-2">
                <span class="required">Icon Class:</span>
              </div>
              <div class="ui-grid-col-6">
                <input type="text" pInputText [pKeyFilter]="noSpecial" formControlName="icon">
              </div>
              <div class="ui-grid-col-4">
                <app-validation-message [entityForm]="entityForm" fieldName="icon"
                                        [validationMessages]="validation_messages"></app-validation-message>
              </div>
            </div>

            <div class="ui-grid-row">
              <div class="ui-grid-col-2">
                <span class="required">Thứ tự:</span>
              </div>
              <div class="ui-grid-col-6">
                <input type="number" pInputText pKeyFilter="int" formControlName="sortOrder">
              </div>
              <div class="ui-grid-col-4">
                <app-validation-message [entityForm]="entityForm" fieldName="sortOrder"
                                        [validationMessages]="validation_messages"></app-validation-message>
              </div>
            </div>

          </div>
          <p-blockUI [target]="pnl" [blocked]="blockedPanel">
            <p-progressSpinner [style]="{width: '100px', height: '100px', position:'absolute',top:'25%',left:'50%'}"
                               strokeWidth="2" animationDuration=".5s"></p-progressSpinner>
          </p-blockUI>
        </p-panel>
      </div>
      <div class="modal-footer">
        <button type="submit" class="btn btn-primary" [disabled]="!entityForm.valid || btnDisabled">Lưu lại</button>
        &nbsp;
        <button type="button" class="btn btn-default">Đóng</button>
      </div>
    </form>
  `,
  imports: [
    ReactiveFormsModule,
    Panel,
    ValidationMessageComponent,
    DropdownModule,
    KeyFilter,
    InputText,
    ProgressSpinner,
    BlockUI
  ]
})
export class FunctionsDetailComponent implements OnInit {

  constructor(
              private functionsService: FunctionsService,
              private notificationService: NotificationService,
              private fb: FormBuilder) {
  }
  public blockedPanel = false;
  public entityForm!: FormGroup;
  public dialogTitle!: string;
  @Input() entityId!: string;
  public btnDisabled = false;

  saved: EventEmitter<any> = new EventEmitter();
  public rootFunctions: any[] = [];

  // Validate
  noSpecial: RegExp = /^[^<>*!_~]+$/;
  validation_messages = {
    'name': [
      { type: 'required', message: 'Bạn phải nhập tên trang' },
      { type: 'minlength', message: 'Bạn phải nhập ít nhất 3 kí tự' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 255 kí tự' }
    ],
    'id': [
      { type: 'required', message: 'Bạn phải nhập mã duy nhất' }
    ],
    'sortOrder': [
      { type: 'required', message: 'Bạn phải nhập thứ tự' }
    ]
  };

  ngOnInit() {
    this.entityForm = this.fb.group({
      'id': new FormControl('', Validators.required),
      'parentId': new FormControl(),
      'name': new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(255),
        Validators.minLength(3)
      ])),
      'url': new FormControl(),
      'icon': new FormControl(),
      'sortOrder': new FormControl(1, Validators.required)
    });
    if (this.entityId) {
      this.dialogTitle = 'Cập nhật';
      this.loadParents(this.entityId);
      this.loadDetail(this.entityId);
      this.entityForm.controls['id'].disable({ onlySelf: true });

    } else {
      this.loadParents(null);
      this.dialogTitle = 'Thêm mới';
    }
  }

  loadDetail(id: any) {
    this.btnDisabled = true;
    this.blockedPanel = true;
    this.functionsService.getDetail(id)
      .subscribe((response: any) => {
        this.entityForm.setValue({
          id: response.id,
          parentId: response.parentId,
          name: response.name,
          url: response.url,
          icon: response.icon,
          sortOrder: response.sortOrder
        });
        setTimeout(() => {
          this.btnDisabled = false;
          this.blockedPanel = false;
        }, 1000);
      }, () => {
        setTimeout(() => {
          this.btnDisabled = false;
          this.blockedPanel = false;
        }, 1000);
      });
  }

  loadParents(id: string | null) {
    this.functionsService.getAllByParentId(id!)
      .subscribe((response: any) => {
        this.rootFunctions = [];
        response.forEach((element: { id: any; name: any; }) => {
          this.rootFunctions.push({
            value: element.id,
            label: element.name
          });
        });
      });
  }

  saveChange() {
    this.btnDisabled = true;
    this.blockedPanel = true;
    if (this.entityId) {
      this.functionsService.update(this.entityId, this.entityForm.getRawValue())
        .subscribe(() => {
          this.notificationService.showSuccess(MessageConstants.UPDATED_OK_MSG);
          this.saved.emit(this.entityForm.value);

          setTimeout(() => {
            this.btnDisabled = false;
            this.blockedPanel = false;
          }, 1000);
        }, () => {
          setTimeout(() => {
            this.btnDisabled = false;
            this.blockedPanel = false;
          }, 1000);
        });
    } else {
      this.functionsService.add(this.entityForm.value)
        .subscribe(() => {

          this.notificationService.showSuccess(MessageConstants.CREATED_OK_MSG);
          this.saved.emit(this.entityForm.value);
          setTimeout(() => {
            this.btnDisabled = false;
            this.blockedPanel = false;
          }, 1000);

        }, () => {
          setTimeout(() => {
            this.btnDisabled = false;
            this.blockedPanel = false;
          }, 1000);
        });

    }
  }

}
