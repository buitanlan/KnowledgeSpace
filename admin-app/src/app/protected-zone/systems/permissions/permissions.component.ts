import { Component } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { TreeTableModule } from 'primeng/treetable';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TreeNode } from 'primeng/api';
import { SystemConstants } from '@app/protected-zone/systems/constants/systems.constant';

@Component({
  selector: 'app-permissions',
  template: `
    <div class="animated fadeIn">
      <p-panel #pnl>
        <p-header>
          <div class="pcol-12">
            <button pButton type="button" label="Lưu lại" *ngIf="selectedRole.id" icon="fa fa-edit"
                    class="ui-button-success" (click)="savePermission()"></button>
            <button pButton type="button" label="Tải lại" icon="fa fa-remove" class="ui-button-primary"
                    (click)="reloadData()"></button>
          </div>
        </p-header>
        <p-panel header="Chọn nhóm" [toggleable]="true" [collapsed]="false" styleClass="m-b-10">
          <div class="row">
            <label for="keyword" class="col-md-3">Nhóm người dùng</label>
            <div class="col-md-9">
              <p-dropdown [options]="roles" (onChange)="changeRole($event)" [style]="{'width':'100%'}" name="roleList"
                          placeholder="Chọn nhóm quyền" optionLabel="name" filter="true" [showClear]="true"
                          [(ngModel)]="selectedRole">
              </p-dropdown>
            </div>
          </div>
        </p-panel>
        <p-treeTable [value]="functions" selectionMode="single" dataKey="id">
          <ng-template pTemplate="header">
            <tr>
              <th>Chức năng</th>
              <th style="width: 130px; text-align: center">
                <p-checkbox (onChange)="selectAll($event,'VIEW')" [(ngModel)]="isSelectedAllViews" name="CheckAll">
                </p-checkbox>
                Xem
              </th>
              <th style="width: 130px; text-align: center">
                <p-checkbox (onChange)="selectAll($event,'CREATE')" [(ngModel)]="isSelectedAllCreates" name="CheckAll">
                </p-checkbox>
                Thêm
              </th>
              <th style="width: 130px; text-align: center">
                <p-checkbox (onChange)="selectAll($event,'UPDATE')" [(ngModel)]="isSelectedAllUpdates" name="CheckAll">
                </p-checkbox>
                Sửa
              </th>
              <th style="width: 130px; text-align: center">
                <p-checkbox (onChange)="selectAll($event,'DELETE')" [(ngModel)]="isSelectedAllDeletes" name="CheckAll">
                </p-checkbox>
                Xóa
              </th>
              <th style="width: 130px; text-align: center">
                <p-checkbox (onChange)="selectAll($event,'APPROVE')" [(ngModel)]="isSelectedAllApproves"
                            name="CheckAll">
                </p-checkbox>
                Duyệt
              </th>
          </ng-template>
          <ng-template pTemplate="body" let-rowNode let-rowData="rowData">
            <tr [ttSelectableRow]="rowNode">
              <td>
                <p-treeTableToggler [rowNode]="rowNode"></p-treeTableToggler>
                {{ rowData.name }}
              </td>
              <th style="width: 100px; text-align: center">
                <ng-container *ngIf="rowData.hasView==true">
                  <p-checkbox name="hasView" (onChange)="checkChanged($event,'VIEW',rowData.id,rowData.parentId)"
                              [(ngModel)]="selectedViews" [value]="rowData.id"></p-checkbox>
                </ng-container>
              </th>
              <th style="width: 100px; text-align: center">
                <ng-container *ngIf="rowData.hasCreate==true">
                  <p-checkbox name="hasCreate" (onChange)="checkChanged($event,'CREATE',rowData.id,rowData.parentId)"
                              [(ngModel)]="selectedCreates" [value]="rowData.id"></p-checkbox>
                </ng-container>
              </th>
              <th style="width: 100px; text-align: center">
                <ng-container *ngIf="rowData.hasUpdate==true">
                  <p-checkbox name="hasUpdate" (onChange)="checkChanged($event,'UPDATE',rowData.id,rowData.parentId)"
                              [(ngModel)]="selectedUpdates" [value]="rowData.id"></p-checkbox>
                </ng-container>
              </th>
              <th style="width: 100px; text-align: center">
                <ng-container *ngIf="rowData.hasDelete==true">
                  <p-checkbox name="hasDelete" (onChange)="checkChanged($event,'DELETE',rowData.id,rowData.parentId)"
                              [(ngModel)]="selectedDeletes" [value]="rowData.id"></p-checkbox>
                </ng-container>
              </th>
              <th style="width: 100px; text-align: center">
                <ng-container *ngIf="rowData.hasApprove==true">
                  <p-checkbox name="hasApprove" (onChange)="checkChanged($event,'APPROVE',rowData.id,rowData.parentId)"
                              [(ngModel)]="selectedApproves" [value]="rowData.id"></p-checkbox>
                </ng-container>
              </th>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6" style="text-align:center">
                Không có dữ liệu, mời bạn chọn nhóm quyền để tải dữ liệu.
              </td>
            </tr>
          </ng-template>
        </p-treeTable>
        <p-blockUI [target]="pnl" [blocked]="blockedPanel">
          <p-progressSpinner [style]="{width: '100px', height: '100px', position:'absolute',top:'25%',left:'50%'}"
                             strokeWidth="2" animationDuration=".5s"></p-progressSpinner>
        </p-blockUI>
      </p-panel>
    </div>
  `,
  imports: [
    PanelModule,
    DropdownModule,
    TreeTableModule,
    CheckboxModule,
    FormsModule,
    BlockUIModule,
    ProgressSpinnerModule
  ],
  standalone: true
})
export class PermissionsComponent {
  private subscription = new Subscription();

  public bsModalRef: BsModalRef;
  public blockedPanel = false;

  public functions: any[];
  public flattenFunctions: any[] = [];
  public selectedRole: any = {
    id: null
  };
  public roles: any[] = [];
  public commands: any[] = [];

  public selectedViews: string[] = [];
  public selectedCreates: string[] = [];
  public selectedUpdates: string[] = [];
  public selectedDeletes: string[] = [];
  public selectedApproves: string[] = [];

  public isSelectedAllViews = false;
  public isSelectedAllCreates = false;
  public isSelectedAllUpdates = false;
  public isSelectedAllDeletes = false;
  public isSelectedAllApproves = false;

  constructor(

    private permissionsService: PermissionsService,
    private rolesService: RolesService,
    private commandsService: CommandsService,
    private _notificationService: NotificationService,
    private _utilityService: UtilitiesService) {
  }


  ngOnInit() {
    this.loadAllRoles();
    this.loadData(this.selectedRole.id);
  }

  changeRole($event: any) {
    if ($event.value != null) {
      this.loadData($event.value.id);
    } else {
      this.functions = [];
    }
  }
  public reloadData() {
    this.loadData(this.selectedRole.id);
  }
  public savePermission() {
    if (this.selectedRole.id == null) {
      this._notificationService.showError('Bạn chưa chọn nhóm quyền.');
      return;
    }
    const listPermissions: Permission[] = [];
    this.selectedCreates.forEach(element => {
      listPermissions.push({
        functionId: element,
        roleId: this.selectedRole.id,
        commandId: SystemConstants.CREATE_ACTION
      });
    });
    this.selectedUpdates.forEach(element => {
      listPermissions.push({
        functionId: element,
        roleId: this.selectedRole.id,
        commandId: SystemConstants.UPDATE_ACTION
      });
    });
    this.selectedDeletes.forEach(element => {
      listPermissions.push({
        functionId: element,
        roleId: this.selectedRole.id,
        commandId: SystemConstants.DELETE_ACTION
      });
    });
    this.selectedViews.forEach(element => {
      listPermissions.push({
        functionId: element,
        roleId: this.selectedRole.id,
        commandId: SystemConstants.VIEW_ACTION
      });
    });

    this.selectedApproves.forEach(element => {
      listPermissions.push({
        functionId: element,
        roleId: this.selectedRole.id,
        commandId: SystemConstants.APPROVE_ACTION
      });
    });
    const permissionsUpdateRequest = new PermissionUpdateRequest();
    permissionsUpdateRequest.permissions = listPermissions;
    this.subscription.add(this.permissionsService.save(this.selectedRole.id, permissionsUpdateRequest)
      .subscribe(() => {
        this._notificationService.showSuccess(MessageConstants.UPDATED_OK_MSG);

        setTimeout(() => { this.blockedPanel = false; }, 1000);
      }, error => {
        setTimeout(() => { this.blockedPanel = false; }, 1000);
      }));
  }
  loadData(roleId) {
    if (roleId != null) {
      this.blockedPanel = true;
      this.subscription.add(this.permissionsService.getFunctionWithCommands()
        .subscribe((response: any) => {
          const unflattering = this._utilityService.UnflatteringForTree(response);
          this.functions = <TreeNode[]>unflattering;
          this.flattenFunctions = response;
          this.fillPermissions(roleId);
          setTimeout(() => { this.blockedPanel = false; }, 1000);
        }, error => {
          setTimeout(() => { this.blockedPanel = false; }, 1000);
        }));
    }

  }
  checkChanged(checked: boolean, commandId: string, functionId: string, parentId: string) {
    if (commandId === SystemConstants.VIEW_ACTION) {
      this.selectedViews = [];
      if (checked) {
        this.selectedViews.push(functionId);
        if (parentId === null) {
          const childFunctions = this.flattenFunctions.filter(x => x.parentId === functionId).map(x => x.id);
          this.selectedViews.push(...childFunctions);
        } else {
          if (this.selectedViews.filter(x => x === parentId).length === 0) {
            this.selectedViews.push(parentId);
          }
        }
      } else {
        this.selectedViews = this.selectedViews.filter(x => x !== functionId);
        if (parentId === null) {
          const childFunctions = this.flattenFunctions.filter(x => x.parentId === functionId).map(x => x.id);
          this.selectedViews = this.selectedViews.filter(function (el) {
            return !childFunctions.includes(el);
          });
        }
      }
    } else if (commandId === SystemConstants.CREATE_ACTION) {
      this.selectedCreates = [];
      if (checked) {
        this.selectedCreates.push(functionId);
        if (parentId === null) {
          const childFunctions = this.flattenFunctions.filter(x => x.parentId === functionId).map(x => x.id);
          this.selectedCreates.push(...childFunctions);
        } else {
          if (this.selectedCreates.filter(x => x === parentId).length === 0) {
            this.selectedCreates.push(parentId);
          }
        }
      } else {
        this.selectedCreates = this.selectedCreates.filter(x => x !== functionId);
        if (parentId === null) {
          const childFunctions = this.flattenFunctions.filter(x => x.parentId === functionId).map(x => x.id);
          this.selectedCreates = this.selectedCreates.filter(function (el) {
            return !childFunctions.includes(el);
          });
        }
      }
    } else if (commandId === SystemConstants.UPDATE_ACTION) {
      this.selectedUpdates = [];

      if (checked) {
        this.selectedUpdates.push(functionId);
        if (parentId === null) {
          const childFunctions = this.flattenFunctions.filter(x => x.parentId === functionId).map(x => x.id);
          this.selectedUpdates.push(...childFunctions);
        } else {
          if (this.selectedUpdates.filter(x => x === parentId).length === 0) {
            this.selectedUpdates.push(parentId);
          }
        }
      } else {
        this.selectedUpdates = this.selectedUpdates.filter(x => x !== functionId);
        if (parentId === null) {
          const childFunctions = this.flattenFunctions.filter(x => x.parentId === functionId).map(x => x.id);
          this.selectedUpdates = this.selectedUpdates.filter(function (el) {
            return !childFunctions.includes(el);
          });
        }
      }
    } else if (commandId === SystemConstants.DELETE_ACTION) {
      this.selectedDeletes = [];

      if (checked) {
        this.selectedDeletes.push(functionId);
        if (parentId === null) {
          const childFunctions = this.flattenFunctions.filter(x => x.parentId === functionId).map(x => x.id);
          this.selectedDeletes.push(...childFunctions);
        } else {
          if (this.selectedDeletes.filter(x => x === parentId).length === 0) {
            this.selectedDeletes.push(parentId);
          }
        }
      } else {
        this.selectedDeletes = this.selectedDeletes.filter(x => x !== functionId);
        if (parentId === null) {
          const childFunctions = this.flattenFunctions.filter(x => x.parentId === functionId).map(x => x.id);
          this.selectedDeletes = this.selectedDeletes.filter(function (el) {
            return !childFunctions.includes(el);
          });
        }
      }
    } else if (commandId === SystemConstants.APPROVE_ACTION) {
      this.selectedApproves = [];

      if (checked) {
        this.selectedApproves.push(functionId);
        if (parentId === null) {
          const childFunctions = this.flattenFunctions.filter(x => x.parentId === functionId).map(x => x.id);
          this.selectedApproves.push(...childFunctions);
        } else {
          if (this.selectedApproves.filter(x => x === parentId).length === 0) {
            this.selectedApproves.push(parentId);
          }
        }
      } else {
        this.selectedApproves = this.selectedApproves.filter(x => x !== functionId);
        if (parentId === null) {
          const childFunctions = this.flattenFunctions.filter(x => x.parentId === functionId).map(x => x.id);
          this.selectedApproves = this.selectedApproves.filter(function (el) {
            return !childFunctions.includes(el);
          });
        }
      }
    }

  }
  selectAll(checked: boolean, uniqueCode: string) {
    if (uniqueCode === SystemConstants.VIEW_ACTION) {
      this.selectedViews = [];
      if (checked) {
        this.selectedViews.push(...this.flattenFunctions.map(x => x.id));
      }
    } else if (uniqueCode === SystemConstants.CREATE_ACTION) {
      this.selectedCreates = [];
      if (checked) {
        this.selectedCreates.push(...this.flattenFunctions.map(x => x.id));
      }
    } else if (uniqueCode === SystemConstants.UPDATE_ACTION) {
      this.selectedUpdates = [];
      if (checked) {
        this.selectedUpdates.push(...this.flattenFunctions.map(x => x.id));
      }
    } else if (uniqueCode === SystemConstants.DELETE_ACTION) {
      this.selectedDeletes = [];
      if (checked) {
        this.selectedDeletes.push(...this.flattenFunctions.map(x => x.id));
      }
    } else if (uniqueCode === SystemConstants.APPROVE_ACTION) {
      this.selectedApproves = [];
      if (checked) {
        this.selectedApproves.push(...this.flattenFunctions.map(x => x.id));
      }
    }
  }
  fillPermissions(roleId: any) {
    this.blockedPanel = true;
    this.subscription.add(this.rolesService.getRolePermissions(roleId)
      .subscribe((response: Permission[]) => {
        this.selectedCreates = [];
        this.selectedUpdates = [];
        this.selectedDeletes = [];
        this.selectedViews = [];
        this.selectedApproves = [];
        response.forEach(element => {
          if (element.commandId === SystemConstants.CREATE_ACTION) {
            this.selectedCreates.push(element.functionId);
          }
          if (element.commandId === SystemConstants.UPDATE_ACTION) {
            this.selectedUpdates.push(element.functionId);
          }
          if (element.commandId === SystemConstants.DELETE_ACTION) {
            this.selectedDeletes.push(element.functionId);
          }
          if (element.commandId === SystemConstants.VIEW_ACTION) {
            this.selectedViews.push(element.functionId);
          }
          if (element.commandId === SystemConstants.APPROVE_ACTION) {
            this.selectedApproves.push(element.functionId);
          }
          setTimeout(() => { this.blockedPanel = false; }, 1000);
        });

      }, error => {
        setTimeout(() => { this.blockedPanel = false; }, 1000);
      }));
  }
  loadAllRoles() {
    this.blockedPanel = true;
    this.subscription.add(this.rolesService.getAll()
      .subscribe((response: any) => {
        this.roles = response;
        setTimeout(() => { this.blockedPanel = false; }, 1000);
      }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
