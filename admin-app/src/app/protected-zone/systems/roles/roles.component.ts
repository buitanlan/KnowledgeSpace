import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ChipsModule } from 'primeng/chips';
import { PanelModule } from 'primeng/panel';
import { CalendarModule } from 'primeng/calendar';
import { NgIf } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { RolesService } from '@app/shared/services/roles.service';
import { NotificationService } from '@app/shared/services/notification.servive';
import { Pagination } from '@app/shared/models/pagination';
import { Role } from '@app/shared/models/role';
import { RolesDetailComponent } from '@app/protected-zone/systems/roles/roles-detail/roles-detail.component';
import { MessageConstants } from '@app/protected-zone/systems/constants';

@Component({
  selector: 'app-roles',
  template: `
    <p>Danh sách nhóm quyền</p>
    <div class="animated fadeIn">
      <p-panel #pnl>
        <p-header>
          <div class="ui-g-6">
            <button
              appPermission
              appFunction="SYSTEM_ROLE"
              appAction="CREATE"
              pButton
              type="button"
              label="Thêm"
              icon="fa fa-plus"
              (click)="showAddModal()"
            ></button>
            <button
              appPermission
              appFunction="SYSTEM_ROLE"
              appAction="DELETE"
              pButton
              type="button"
              label="Xóa"
              icon="fa fa-trash"
              class="ui-button-danger"
              *ngIf="selectedItems.length > 0"
              (click)="deleteItems()"
            ></button>
            <button
              appPermission
              appFunction="SYSTEM_ROLE"
              appAction="UPDATE"
              pButton
              type="button"
              label="Sửa"
              icon="fa fa-edit"
              class="ui-button-warning"
              *ngIf="selectedItems.length == 1"
              (click)="showEditModal()"
            ></button>
          </div>
          <div class="ui-g-6">
            <input
              style="width: 100%;"
              pInputText
              (keyup.enter)="loadData()"
              [(ngModel)]="keyword"
              placeholder="Nhập từ khóa..."
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
        >
          <ng-template pTemplate="header">
            <tr>
              <th style="width: 35px">
                <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
              </th>
              <th [pSortableColumn]="'Name'">
                Mã
                <p-sortIcon [field]="'Name'"></p-sortIcon>
              </th>
              <th [pSortableColumn]="'Description'">
                Mô tả nhóm
                <p-sortIcon [field]="'Description'"></p-sortIcon>
              </th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr [pSelectableRow]="row">
              <td style="width: 35px;">
                <span class="ui-column-title">Lựa chọn</span>
                <p-tableCheckbox [value]="row"></p-tableCheckbox>
              </td>
              <td>{{ row.id }}</td>
              <td>{{ row.name }}</td>
            </tr>
          </ng-template>
          <ng-template pTemplate="summary">
            <div style="text-align: left">Tổng số bản ghi: {{ totalRecords }}</div>
          </ng-template>
        </p-table>
        <p-footer>
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
        </p-footer>
      </p-panel>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TableModule,
    FormsModule,
    ChipsModule,
    PanelModule,
    CalendarModule,
    NgIf,
    PaginatorModule,
    BlockUIModule,
    ProgressSpinnerModule
  ]
})
export class RolesComponent {
  private subscription = new Subscription();
  // Default
  public bsModalRef!: BsModalRef;
  public blockedPanel = false;
  /**
   * Paging
   */
  public pageIndex = 1;
  public pageSize = 10;
  public pageDisplay = 10;
  public totalRecords!: number;
  public keyword = '';
  // Role
  public items!: any[];
  public selectedItems: any[] = [];
  constructor(
    private rolesService: RolesService,
    private notificationService: NotificationService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(selectedId = null) {
    this.blockedPanel = true;
    this.subscription.add(
      this.rolesService.getAllPaging(this.keyword, this.pageIndex, this.pageSize).subscribe(
        (response: Pagination<Role>) => {
          this.processLoadData(selectedId, response);
          setTimeout(() => {
            this.blockedPanel = false;
          }, 1000);
        },
        (error) => {
          setTimeout(() => {
            this.blockedPanel = false;
          }, 1000);
        }
      )
    );
  }
  private processLoadData(selectedId = null, response: Pagination<Role>) {
    this.items = response.items;
    this.pageIndex = this.pageIndex;
    this.pageSize = this.pageSize;
    this.totalRecords = response.totalRecords;
    if (this.selectedItems.length === 0 && this.items.length > 0) {
      this.selectedItems.push(this.items[0]);
    }
    if (selectedId != null && this.items.length > 0) {
      this.selectedItems = this.items.filter((x) => x.Id === selectedId);
    }
  }
  pageChanged(event: any): void {
    this.pageIndex = event.page + 1;
    this.pageSize = event.rows;
    this.loadData();
  }

  showAddModal() {
    this.bsModalRef = this.modalService.show(RolesDetailComponent, {
      class: 'modal-lg',
      backdrop: 'static'
    });
    this.bsModalRef.content.savedEvent.subscribe(() => {
      this.bsModalRef.hide();
      this.loadData();
      this.selectedItems = [];
    });
  }
  showEditModal() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    const initialState = {
      entityId: this.selectedItems[0].id
    };
    this.bsModalRef = this.modalService.show(RolesDetailComponent, {
      initialState: initialState,
      class: 'modal-lg',
      backdrop: 'static'
    });

    this.subscription.add(
      this.bsModalRef.content.savedEvent.subscribe((response: { id: null | undefined }) => {
        this.bsModalRef.hide();
        this.loadData(response.id);
      })
    );
  }

  deleteItems() {
    const id = this.selectedItems[0].id;
    this.notificationService.showConfirmation(MessageConstants.CONFIRM_DELETE_MSG, () => this.deleteItemsConfirm(id));
  }
  deleteItemsConfirm(id: any) {
    this.blockedPanel = true;
    this.subscription.add(
      this.rolesService.delete(id).subscribe(
        () => {
          this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
          this.loadData();
          this.selectedItems = [];
          setTimeout(() => {
            this.blockedPanel = false;
          }, 1000);
        },
        (error) => {
          setTimeout(() => {
            this.blockedPanel = false;
          }, 1000);
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
