import { Component, inject, Inject, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api/treenode';
import { FunctionsService } from '@app/shared/services/functions.service';
import { FunctionsDetailComponent } from './functions-detail/functions-detail.component';
import { CommandsAssignComponent } from './commands-assign/commands-assign.component';
import { PermissionDirective } from '@app/shared/directives/permission-directive.directive';
import { ButtonDirective, ButtonIcon } from 'primeng/button';
import { NgIf } from '@angular/common';
import { Checkbox } from 'primeng/checkbox';
import { TreeTableModule } from 'primeng/treetable';
import { BlockUI } from 'primeng/blockui';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Panel } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { MessageConstants } from '@app/protected-zone/systems/constants/messages.constant';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NotificationService } from '@app/shared/services/notification.service';
import { unflatteringForTree } from '@app/shared/utils/util';
import { CommandAssign } from '@app/shared/models/CommandAssign';

@Component({
  selector: 'app-functions',
  template: `
    <div class="animated fadeIn">
      <p-panel #pnl [style]="{'margin-bottom':'10px'}">
        <p-header>
          <div class="ui-g-4">
            <button appPermission appFunction="SYSTEM_FUNCTION" appAction="CREATE" pButton type="button" label="Thêm"
                    pButtonIcon="fa fa-plus" (click)="showAddModal()"></button>
            <button appPermission appFunction="SYSTEM_FUNCTION" appAction="DELETE" pButton type="button" label="Xóa"
                    pButtonIcon="fa fa-trash" class="ui-button-danger" *ngIf="selectedItems.length > 0"
                    (click)="deleteItems()"></button>
            <button appPermission appFunction="SYSTEM_FUNCTION" appAction="UPDATE" pButton type="button" label="Sửa"
                    pButtonIcon="fa fa-edit" class="ui-button-warning" *ngIf="selectedItems.length== 1"
                    (click)="showEditModal()"></button>
          </div>
          <div class="ui-g-4">
            <p-checkbox label="Hiển thị hành động" [(ngModel)]="showCommandGrid" (click)="togglePanel()" binary="true">
            </p-checkbox>
          </div>

        </p-header>
        <p-treeTable *ngIf="items" [value]="items" selectionMode="multiple" [(selection)]="selectedItems"
                     [metaKeySelection]="true" (onNodeSelect)="nodeSelect($event)"
                     (onNodeUnselect)="nodeUnSelect($event)"
                     [scrollable]="true">
          <ng-template pTemplate="header">
            <tr>
              <th style="width: 10%;">
                <p-treeTableHeaderCheckbox></p-treeTableHeaderCheckbox>
              </th>
              <th>Tên</th>
              <th class="pgrid-hidden-xs">Mã</th>
              <th>Thứ tự</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-rowNode let-rowData="rowData">
            <tr [ttSelectableRow]="rowNode">
              <td style="width: 10%;">
                <p-treeTableToggler [rowNode]="rowNode"></p-treeTableToggler>
                <p-treeTableCheckbox [value]="rowNode"></p-treeTableCheckbox>
              </td>
              <td>
                {{ rowData.name }}
              </td>
              <td class="pgrid-hidden-xs">
                {{ rowData.id }}
              </td>
              <td class="pgrid-hidden-sm">
                {{ rowData.sortOrder }}
              </td>

            </tr>
          </ng-template>
        </p-treeTable>
        <p-blockUI [target]="pnl" [blocked]="blockedPanel">
          <p-progressSpinner [style]="{width: '100px', height: '100px', position:'absolute',top:'25%',left:'50%'}"
                             strokeWidth="2" animationDuration=".5s"></p-progressSpinner>
        </p-blockUI>
      </p-panel>

      <p-panel #pnlCommand *ngIf="showCommandGrid">
        <p-header>
          <div class="pcol-12">
            <button pButton type="button" label="Thêm hành động" icon="fa fa-plus" *ngIf="selectedItems.length == 1"
                    (click)="addCommandsToFunction()"></button>
            <button pButton type="button" label="Xóa hành động" icon="fa fa-trash" class="ui-button-danger"
                    *ngIf="selectedCommandItems.length > 0" (click)="removeCommands()"></button>
          </div>
        </p-header>
        <p-table #dt [value]="commands" selectionMode="multiple" [metaKeySelection]="true"
                 [(selection)]="selectionCommandItems" [scrollable]="true">
          <ng-template pTemplate="header">
            <tr>
              <th style="width: 35px">
                <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
              </th>
              <th>Mã hành động
              </th>
              <th>Tên hành động
              </th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr [pSelectableRow]="row">
              <td style="width: 35px">
                <span class="ui-column-title">Lựa chọn</span>
                <p-tableCheckbox [value]="row"></p-tableCheckbox>
              </td>
              <td>{{ row.id }}</td>
              <td>{{ row.name }}</td>
            </tr>
          </ng-template>
        </p-table>
        <p-blockUI [target]="pnlCommand" [blocked]="blockedPanelAction">
          <p-progressSpinner [style]="{width: '100px', height: '100px', position:'absolute',top:'25%',left:'50%'}"
                             strokeWidth="2" animationDuration=".5s"></p-progressSpinner>
        </p-blockUI>
      </p-panel>
    </div>
  `,
  imports: [
    PermissionDirective,
    ButtonDirective,
    NgIf,
    Checkbox,
    TreeTableModule,
    BlockUI,
    ProgressSpinner,
    Panel,
    TableModule,
    FormsModule,
    ButtonIcon
  ]
})
export class FunctionsComponent implements OnInit {

  public blockedPanel = false;
  public blockedPanelCommand = false;
  public showCommandGrid = false;
  // -----------------Function-----------------
  public items: TreeNode[] = [];
  public selectedItems: any[] = [];

  // ---------------Command------------------------------
  public commands: any[] = [];
  public selectedCommandItems : any[] = [];
  dialogService = inject(DialogService);
  dialogRef: DynamicDialogRef | undefined;
  selectionCommandItems: any;
  blockedPanelAction: unknown;

  constructor(
    private functionsService: FunctionsService,
    private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.loadData();
  }

  togglePanel() {
    if (this.showCommandGrid) {
      if (this.selectedItems.length === 1) {
        this.loadDataCommand();
      }
    }

  }
  loadData(selectionId = null) {
    this.blockedPanel = true;
    this.functionsService.getAll()
      .subscribe((response: any) => {
        const functionTree = unflatteringForTree(response);
        this.items = <TreeNode[]>functionTree;
        if (this.selectedItems.length === 0 && this.items.length > 0) {
          this.selectedItems.push(this.items[0]);
          this.loadDataCommand();
        }
        // Nếu có là sửa thì chọn selection theo Id
        if (selectionId != null && this.items.length > 0) {
          this.selectedItems = this.items.filter(x => x.data.id == selectionId);
        }

        setTimeout(() => { this.blockedPanel = false; }, 1000);
      }, (error: any) => {
        setTimeout(() => { this.blockedPanel = false; }, 1000);
      });
  }

  showAddModal() {
    this.dialogRef = this.dialogService.open(FunctionsDetailComponent, {
      header : 'AddModal',
    });

    this.dialogRef?.onClose.subscribe((response: any) => {
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
      // @ts-ignore
      entityId: this.selectedItems[0].data.id
    };
    this.dialogRef = this.dialogService.open(FunctionsDetailComponent,
      {
        inputValues: {
          // @ts-ignore
          entityId: this.selectedItems[0].data.id
        },
        header : 'AddModal',
      });


    this.dialogRef.onClose.subscribe((response: any) => {
      this.loadData(response.id);
    });
  }

  nodeSelect(event: any) {
    this.selectedCommandItems = [];
    this.commands = [];
    if (this.selectedItems.length === 1 && this.showCommandGrid) {
      this.loadDataCommand();
    }
  }

  nodeUnSelect(event: any) {
    this.selectedCommandItems = [];
    this.commands = [];
    if (this.selectedItems.length === 1 && this.showCommandGrid) {
      this.loadDataCommand();
    }
  }

  deleteItems() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    const id = this.selectedItems[0].id;
    this.notificationService.showConfirmation(MessageConstants.CONFIRM_DELETE_MSG,
      () => this.deleteItemsConfirm(id));
  }

  deleteItemsConfirm(id: string) {
    this.blockedPanel = true;
    this.functionsService.delete(id).subscribe(() => {
      this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
      this.loadData();
      this.selectedItems = [];
      setTimeout(() => { this.blockedPanel = false; }, 1000);
    }, () => {
      setTimeout(() => { this.blockedPanel = false; }, 1000);
    });
  }
  loadDataCommand() {
    this.blockedPanelCommand = true;
    this.functionsService.getAllCommandsByFunctionId(this.selectedItems[0].id)
      .subscribe((response: any) => {

        this.commands = response;
        if (this.selectedCommandItems.length === 0 && this.commands.length > 0) {
          this.selectedCommandItems.push(this.commands[0]);
        }
        this.blockedPanelCommand = false;
      }, (error: any) => {
        this.blockedPanelCommand = false;
      });
  }

  removeCommands() {
    const selectedCommandIds: any[] = [];
    this.selectedCommandItems.forEach(element => {
      selectedCommandIds.push(element.id);
    });
    this.notificationService.showConfirmation(MessageConstants.CONFIRM_DELETE_MSG,
      () => this.removeCommandsConfirm(selectedCommandIds));
  }

  removeCommandsConfirm(ids: string[]) {
    this.blockedPanelCommand = true;
    const entity = {} as CommandAssign;
    entity.commandIds = ids;
    this.functionsService.deleteCommandsFromFunction(this.selectedItems[0].id, entity).subscribe(() => {
      this.loadDataCommand();
      this.selectedCommandItems = [];
      this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
      this.blockedPanelCommand = false;
    }, (error: any) => {
      this.blockedPanelCommand = false;
    });
  }

  addCommandsToFunction() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }

    this.dialogRef = this.dialogService.open(CommandsAssignComponent,
      {
        inputValues: {
          existingCommands: this.commands.map(x => x.Id),
          functionId: this.selectedItems[0].id
        }

      });
    this.dialogRef.onClose.subscribe((response: any[]) => {
      this.loadDataCommand();
      this.selectedCommandItems = [];
    });
  }
}
