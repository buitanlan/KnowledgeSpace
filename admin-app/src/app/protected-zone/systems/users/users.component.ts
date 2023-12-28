import { Component, inject, OnInit } from '@angular/core';
import { User } from '@app/shared/models/user';
import { Observable, of } from 'rxjs';
import { UsersService } from '@app/shared/services/users.service';
import { AsyncPipe, DatePipe, DecimalPipe, NgForOf, NgIf, NgIfContext } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotificationService } from '@app/shared/services/notification.servive';
import { Pagination } from '@app/shared/models/pagination';
import { UsersDetailComponent } from '@app/protected-zone/systems/users/users-detail.component';
import { MessageConstants } from '@app/protected-zone/systems/constants';
import { RolesAssignComponent } from '@app/protected-zone/systems/users/roles-assign.component';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { PaginatorModule } from 'primeng/paginator';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-users',
  template: `
    <div class="animated fadeIn">
      <p-panel #pnl [style]="{ 'margin-bottom': '10px' }">
        <p-header>
          <div class="ui-g-6">
            <button
              appPermission
              appFunction="SYSTEM_USER"
              appAction="CREATE"
              pButton
              type="button"
              label="Thêm"
              icon="fa fa-plus"
              (click)="showAddModal()"
            ></button>
            @if (selectedItems.length > 0) {
              <button
                appPermission
                appFunction="SYSTEM_USER"
                appAction="DELETE"
                pButton
                type="button"
                label="Xóa"
                icon="fa fa-trash"
                class="ui-button-danger"
                (click)="deleteItems()"
              ></button>
            }
            @if (selectedItems.length == 1) {
              <button
                appPermission
                appFunction="SYSTEM_USER"
                appAction="UPDATE"
                pButton
                type="button"
                label="Sửa"
                icon="fa fa-edit"
                class="ui-button-warning"
                (click)="showEditModal()"
              ></button>
            }
          </div>
          <div class="ui-g-3">
            <p-checkbox label="Gán quyền" [(ngModel)]="showRoleAssign" (click)="showHideRoleTable()" [binary]="true">
            </p-checkbox>
          </div>
          <div class="ui-g-3">
            <input
              style="width: 100%;"
              pInputText
              (keyup.enter)="loadData()"
              [(ngModel)]="keyword"
              placeholder="Nhập tên người dùng..."
              type="text"
            />
          </div>
        </p-header>
        <p-table
          #dt
          [value]="items"
          selectionMode="multiple"
          [(selection)]="selectedItems"
          [metaKeySelection]="true"
          [responsive]="true"
          [scrollable]="true"
          (onRowSelect)="onRowSelect($event)"
          (onRowUnselect)="onRowUnselect($event)"
        >
          <ng-template pTemplate="header">
            <tr>
              <th style="width: 35px">
                <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
              </th>
              <th [pSortableColumn]="'userName'">
                Tài khoản
                <p-sortIcon [field]="'UserName'"></p-sortIcon>
              </th>
              <th [pSortableColumn]="'firstName'">
                Tên
                <p-sortIcon [field]="'firstName'"></p-sortIcon>
              </th>
              <th [pSortableColumn]="'lastName'">
                Họ
                <p-sortIcon [field]="'firstName'"></p-sortIcon>
              </th>
              <th [pSortableColumn]="'email'">
                Email
                <p-sortIcon [field]="'email'"></p-sortIcon>
              </th>
              <th style="width: 100px" [pSortableColumn]="'dob'">
                Ngày sinh
                <p-sortIcon [field]="'dob'"></p-sortIcon>
              </th>
              <th style="width: 100px" [pSortableColumn]="'phoneNumber'">
                Số điện thoại
                <p-sortIcon [field]="'phoneNumber'"></p-sortIcon>
              </th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr [pSelectableRow]="row">
              <td style="width: 35px;">
                <span class="ui-column-title">Lựa chọn</span>
                <p-tableCheckbox [value]="row"></p-tableCheckbox>
              </td>
              <td>{{ row.userName }}</td>
              <td>{{ row.firstName }}</td>
              <td>{{ row.lastName }}</td>
              <td>{{ row.email }}</td>
              <td style="width: 100px">{{ row.dob | date: 'dd/MM/yyyy' }}</td>
              <td style="width: 100px">{{ row.phoneNumber }}</td>
            </tr>
          </ng-template>
          <ng-template pTemplate="summary">
            <div style="text-align: left">Tổng số bản ghi: {{ totalRecords | number }}</div>
          </ng-template>
        </p-table>
        <p-paginator
          [rows]="pageSize"
          [totalRecords]="totalRecords"
          (onPageChange)="pageChanged($event)"
          [rowsPerPageOptions]="[10, 20, 50, 100]"
        ></p-paginator>
        <p-blockUI [target]="pnl" [blocked]="blockedPanel">
          <p-progressSpinner
            [style]="{ width: '100px', height: '100px', position: 'absolute', top: '25%', left: '50%' }"
            strokeWidth="2"
            animationDuration=".5s"
          ></p-progressSpinner>
        </p-blockUI>
      </p-panel>

      @if (showRoleAssign) {
        <p-panel #pnlRole>
          <p-header>
            <div class="pcol-12">
              @if (selectedItems != null) {
                <button
                  appPermission
                  appFunction="ROLE"
                  appAction="CREATE"
                  pButton
                  type="button"
                  label="Thêm quyền"
                  icon="fa fa-plus"
                  (click)="addUserRole()"
                ></button>
              }
              @if (selectedRoleItems.length > 0) {
                <button
                  appPermission
                  appFunction="ROLE"
                  appAction="DELETE"
                  pButton
                  type="button"
                  label="Xóa quyền"
                  icon="fa fa-remove"
                  class="ui-button-danger"
                  (click)="removeRoles()"
                ></button>
              }
            </div>
          </p-header>
          <p-table
            #dt2
            [value]="userRoles"
            selectionMode="multiple"
            [(selection)]="selectedRoleItems"
            [metaKeySelection]="true"
            [responsive]="true"
            [scrollable]="true"
          >
            <ng-template pTemplate="header">
              <tr>
                <th style="width: 35px">
                  <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
                </th>
                <th [pSortableColumn]="'name'">
                  Tên quyền
                  <p-sortIcon [field]="'name'"></p-sortIcon>
                </th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row>
              <tr [pSelectableRow]="row">
                <td style="width: 35px;">
                  <span class="ui-column-title">Lựa chọn</span>
                  <p-tableCheckbox [value]="row"></p-tableCheckbox>
                </td>
                <td>{{ row }}</td>
              </tr>
            </ng-template>
            <ng-template pTemplate="summary">
              <div style="text-align: left">Tổng số quyền: {{ totalUserRoleRecords }}</div>
            </ng-template>
          </p-table>
          <p-blockUI [target]="pnlRole" [blocked]="blockedPanelRole">
            <p-progressSpinner
              [style]="{ width: '100px', height: '100px', position: 'absolute', top: '25%', left: '50%' }"
              strokeWidth="2"
              animationDuration=".5s"
            ></p-progressSpinner>
          </p-blockUI>
        </p-panel>
      }
    </div>
  `,
  imports: [
    NgForOf,
    AsyncPipe,
    BlockUIModule,
    ProgressSpinnerModule,
    TableModule,
    PanelModule,
    PaginatorModule,
    CheckboxModule,
    DatePipe,
    DecimalPipe,
    NgIf
  ],
  standalone: true
})
export class UsersComponent implements OnInit {
  public users$: Observable<User[]> = of([]);
  usersService = inject(UsersService);
  modalService = inject(BsModalService);

  // Default
  public bsModalRef!: BsModalRef;
  public blockedPanel = false;
  public blockedPanelRole = false;
  /**
   * Paging
   */
  public pageIndex = 1;
  public pageSize = 10;
  public pageDisplay = 10;
  public totalRecords!: number;
  public keyword = '';

  // Users
  public items!: any[];
  public selectedItems: any[] = [];
  public selectedRoleItems: any[] = [];
  // Role
  public userRoles: any[] = [];
  public showRoleAssign = false;
  public totalUserRoleRecords!: number;

  ngOnInit() {
    this.loadData();
  }

  showHideRoleTable() {
    if (this.showRoleAssign) {
      if (this.selectedItems.length === 1) {
        this.loadUserRoles();
      }
    }
  }

  loadData(selectionId = null) {
    this.blockedPanel = true;
    this.usersService.getAllPaging(this.keyword, this.pageIndex, this.pageSize).subscribe(
      (response: Pagination<User>) => {
        this.items = response.items;
        this.pageIndex = this.pageIndex;
        this.pageSize = this.pageSize;
        this.totalRecords = response.totalRecords;
        if (this.selectedItems.length === 0 && this.items.length > 0) {
          this.selectedItems.push(this.items[0]);
        }
        // Nếu có là sửa thì chọn selection theo Id
        if (selectionId != null && this.items.length > 0) {
          this.selectedItems = this.items.filter((x) => x.Id === selectionId);
        }

        // Load data grid 02
        if (this.showRoleAssign) {
          this.loadUserRoles();
        }

        setTimeout(() => {
          this.blockedPanel = false;
        }, 1000);
      },
      (error) => {
        setTimeout(() => {
          this.blockedPanel = false;
        }, 1000);
      }
    );
  }

  pageChanged(event: any): void {
    this.pageIndex = event.page + 1;
    this.pageSize = event.rows;
    this.loadData();
  }

  onRowSelectAll() {
    this.selectedRoleItems = [];
    this.totalUserRoleRecords = 0;
    this.userRoles = [];
  }

  onRowSelect(event: any) {
    this.selectedRoleItems = [];
    this.totalUserRoleRecords = 0;
    this.userRoles = [];
    if (this.selectedItems.length === 1 && this.showRoleAssign) {
      this.loadUserRoles();
    }
  }

  onRowUnselect(event: any) {
    this.selectedRoleItems = [];
    this.totalUserRoleRecords = 0;
    this.userRoles = [];
    if (this.selectedItems.length === 1 && this.showRoleAssign) {
      this.loadUserRoles();
    }
  }

  showAddModal() {
    this.bsModalRef = this.modalService.show(UsersDetailComponent, {
      class: 'modal-lg',
      backdrop: 'static'
    });
    this.bsModalRef.content.saved.subscribe(() => {
      this.bsModalRef.hide();
      this.loadData();
      this.selectedItems = [];
    });
  }
  showEditModal() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      this.messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' });

      return;
    }
    const initialState = {
      entityId: this.selectedItems[0].id
    };
    this.bsModalRef = this.modalService.show(UsersDetailComponent, {
      initialState: initialState,
      class: 'modal-lg',
      backdrop: 'static'
    });

    this.bsModalRef.content.saved.subscribe((response: any) => {
      this.bsModalRef.hide();
      this.loadData(response.id);
    });
  }

  deleteItems() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      this.messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' });

      return;
    }
    const id = this.selectedItems[0].id;
    this.notificationService.showConfirmation(MessageConstants.CONFIRM_DELETE_MSG, () => this.deleteItemsConfirm(id));
  }

  deleteItemsConfirm(ids: string) {
    this.blockedPanel = true;
    this.usersService.delete(ids).subscribe(
      () => {
        this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
        this.messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' });

        this.loadData();
        this.selectedItems = [];
        this.loadUserRoles();
        setTimeout(() => {
          this.blockedPanel = false;
        }, 1000);
      },
      (error) => {
        this.notificationService.showError(error);
        this.messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' });

        setTimeout(() => {
          this.blockedPanel = false;
        }, 1000);
      }
    );
  }

  // For user roles
  loadUserRoles() {
    this.blockedPanelRole = true;
    // Nếu tồn tại selection thì thực hiện
    if (this.selectedItems != null && this.selectedItems.length > 0) {
      const userId = this.selectedItems[0].id;
      this.usersService.getUserRoles(userId).subscribe(
        (response: any) => {
          this.userRoles = response;
          this.totalUserRoleRecords = response.length;
          if (this.selectedRoleItems.length === 0 && this.userRoles.length > 0) {
            this.selectedRoleItems.push(this.userRoles[0]);
          }
          setTimeout(() => {
            this.blockedPanelRole = false;
          }, 1000);
        },
        (error) => {
          setTimeout(() => {
            this.blockedPanelRole = false;
          }, 1000);
        }
      );
    } else {
      this.selectedRoleItems = [];
      setTimeout(() => {
        this.blockedPanelRole = false;
      }, 1000);
    }
  }
  removeRoles() {
    const selectedRoleNames = this.selectedRoleItems;

    this.notificationService.showConfirmation(MessageConstants.CONFIRM_DELETE_MSG, () =>
      this.deleteRolesConfirm(selectedRoleNames)
    );
  }

  deleteRolesConfirm(roleNames: any) {
    this.blockedPanelRole = true;
    this.usersService.removeRolesFromUser(this.selectedItems[0].id, roleNames).subscribe(
      () => {
        this.loadUserRoles();
        this.selectedRoleItems = [];
        this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
        setTimeout(() => {
          this.blockedPanelRole = false;
        }, 1000);
      },
      (error) => {
        this.notificationService.showError(error);
        setTimeout(() => {
          this.blockedPanelRole = false;
        }, 1000);
      }
    );
  }

  addUserRole() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    const initialState = {
      existingRoles: this.userRoles,
      userId: this.selectedItems[0].id
    };
    this.bsModalRef = this.modalService.show(RolesAssignComponent, {
      initialState: initialState,
      class: 'modal-lg',
      backdrop: 'static'
    });
    this.bsModalRef.content.chosenEvent.subscribe((response: any[]) => {
      this.bsModalRef.hide();
      this.loadUserRoles();
      this.selectedRoleItems = [];
    });
  }
}
