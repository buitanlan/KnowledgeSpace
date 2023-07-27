import { ChangeDetectionStrategy, Component, EventEmitter, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PanelModule } from 'primeng/panel';
import { ChipsModule } from 'primeng/chips';
import { KeyFilterModule } from 'primeng/keyfilter';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-roles-detail-root',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">{{ dialogTitle }}</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <form class="form-horizontal form-label-left" novalidate [formGroup]="entityForm">
      <div class="modal-body div-scroll">
        <p-panel #pnl header="Thông tin" [toggleable]="true" [collapsed]="false" styleClass="m-b-10">
          <div class="ui-grid ui-grid-responsive ui-grid-pad ui-fluid">
            <div class="ui-grid-row">
              <div class="ui-grid-col-2">
                <span class="required">Mã:</span>
              </div>
              <div class="ui-grid-col-6">
                <input type="text" pInputText pKeyFilter="alphanum" formControlName="id" />
              </div>
              <div class="ui-grid-col-4">
                <app-validation-message
                  [entityForm]="entityForm"
                  fieldName="id"
                  [validationMessages]="validation_messages"
                ></app-validation-message>
              </div>
            </div>

            <div class="ui-grid-row">
              <div class="ui-grid-col-2">
                <span class="required">Tên:</span>
              </div>
              <div class="ui-grid-col-6">
                <input type="text" pInputText pKeyFilter="alphanum" formControlName="name" />
              </div>
              <div class="ui-grid-col-4">
                <app-validation-message
                  [entityForm]="entityForm"
                  fieldName="name"
                  [validationMessages]="validation_messages"
                ></app-validation-message>
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
        <button type="button" (click)="saveChange()" class="btn btn-primary">Lưu lại</button>
        &nbsp;
        <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">Đóng</button>
      </div>
    </form>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BsModalRef,
    PanelModule,
    ReactiveFormsModule,
    ChipsModule,
    KeyFilterModule,
    BlockUIModule,
    ProgressSpinnerModule
  ]
})
export class RolesDetailComponent {
  private subscription = new Subscription();
  public entityForm!: FormGroup;
  public dialogTitle!: string;
  private savedEvent: EventEmitter<any> = new EventEmitter();
  public entityId!: string;
  public btnDisabled = false;
  public blockedPanel = false;

  readonly bsModalRef = inject(BsModalRef);
  readonly roleService = inject(RolesService);
  readonly notificationService = inject(NotificationService);
  readonly fb = inject(FormBuilder);

  // Validate
  validation_messages = {
    id: [
      { type: 'required', message: 'Trường này bắt buộc' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 25 kí tự' }
    ],
    name: [
      { type: 'required', message: 'Trường này bắt buộc' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 30 kí tự' }
    ]
  };

  ngOnInit() {
    this.entityForm = this.fb.group({
      id: new FormControl(
        { value: '', disabled: true },
        Validators.compose([Validators.required, Validators.maxLength(50)])
      ),
      name: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(50)]))
    });
    if (this.entityId) {
      this.dialogTitle = 'Cập nhật';
      this.loadFormDetails(this.entityId);
      this.entityForm.controls['id'].disable({ onlySelf: true });
    } else {
      this.dialogTitle = 'Thêm mới';
      this.entityForm.controls['id'].enable({ onlySelf: true });
    }
  }

  private loadFormDetails(id: any) {
    this.blockedPanel = true;
    this.subscription.add(
      this.rolesService.getDetail(id).subscribe(
        (response: any) => {
          this.entityForm.setValue({
            id: response.id,
            name: response.name
          });
          setTimeout(() => {
            this.blockedPanel = false;
            this.btnDisabled = false;
          }, 1000);
        },
        (error) => {
          setTimeout(() => {
            this.blockedPanel = false;
            this.btnDisabled = false;
          }, 1000);
        }
      )
    );
  }
  public saveChange() {
    this.btnDisabled = true;
    this.blockedPanel = true;
    if (this.entityId) {
      this.subscription.add(
        this.rolesService.update(this.entityId, this.entityForm.getRawValue()).subscribe(
          () => {
            this.savedEvent.emit(this.entityForm.value);
            this.notificationService.showSuccess(MessageConstants.UPDATED_OK_MSG);
            this.btnDisabled = false;
            setTimeout(() => {
              this.blockedPanel = false;
              this.btnDisabled = false;
            }, 1000);
          },
          (error) => {
            setTimeout(() => {
              this.blockedPanel = false;
              this.btnDisabled = false;
            }, 1000);
          }
        )
      );
    } else {
      this.subscription.add(
        this.rolesService.add(this.entityForm.getRawValue()).subscribe(
          () => {
            this.savedEvent.emit(this.entityForm.value);
            this.notificationService.showSuccess(MessageConstants.CREATED_OK_MSG);
            this.btnDisabled = false;
            setTimeout(() => {
              this.blockedPanel = false;
              this.btnDisabled = false;
            }, 1000);
          },
          (error) => {
            setTimeout(() => {
              this.blockedPanel = false;
              this.btnDisabled = false;
            }, 1000);
          }
        )
      );
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
