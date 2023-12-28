import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UsersService } from '@app/shared/services/users.service';
import { RolesService } from '@app/shared/services/roles.service';
import { NgIf } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-roles-assign',
  template: `
    <!--Modal add and edit-->
    <div class="modal-header">
      <h4 class="modal-title pull-left">{{ title }}</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body div-scroll">
      <p-table
        #dt2
        [value]="items"
        selectionMode="multiple"
        [(selection)]="selectedItems"
        [metaKeySelection]="true"
        [responsive]="true"
        [scrollable]="true"
        scrollHeight="400px"
      >
        <ng-template pTemplate="header">
          <tr>
            <th style="width: 35px">
              <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
            </th>
            <th [pSortableColumn]="'id'">
              Mã quyền
              <p-sortIcon [field]="'id'"></p-sortIcon>
            </th>
            <th [pSortableColumn]="'name'">
              Tên quyền
              <p-sortIcon [field]="'name'"></p-sortIcon>
            </th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-row="">
          <tr [pSelectableRow]="row">
            <td style="width: 35px;">
              <span class="ui-column-title">Lựa chọn</span>
              <p-tableCheckbox [value]="row"></p-tableCheckbox>
            </td>
            <td>{{ row.id }}</td>
            <td>{{ row.name }}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
    <div class="modal-footer">
      @if (selectedItems.length > 0) {
        <button type="submit" class="btn btn-success" (click)="chooseRoles()">Chọn</button>
      }
      &nbsp
      <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">Đóng</button>
    </div>
  `,
  standalone: true,
  imports: [NgIf, TableModule]
})
export class RolesAssignComponent implements OnInit {
  bsModalRef = inject(BsModalRef);
  usersService = inject(UsersService);
  rolesService = inject(RolesService);

  private chosenEvent: EventEmitter<any> = new EventEmitter();
  public blockedPanel = false;
  // User Role
  public items!: any[];
  public selectedItems: any[] = [];
  public title!: string;
  public userId!: string;
  public existingRoles!: any[];

  ngOnInit() {
    this.loadAllRoles();
  }

  loadAllRoles() {
    this.blockedPanel = true;
    this.rolesService.getAll().subscribe((response: any) => {
      response.forEach(function (element: any) {
        element.Selected = false;
      });
      const existingRoles = this.existingRoles;
      this.items = response.filter((item: any) => existingRoles.indexOf(item.id) === -1);
      if (this.selectedItems.length === 0 && this.items.length > 0) {
        this.selectedItems.push(this.items[0] as any);
      }
      setTimeout(() => {
        this.blockedPanel = false;
      }, 1000);
    });
  }

  chooseRoles() {
    this.blockedPanel = true;
    const selectedNames: any[] = [];
    this.selectedItems.forEach((element) => {
      selectedNames.push(element.name);
    });
    const assignRolesToUser = {
      roleNames: selectedNames
    };
    this.usersService.assignRolesToUser(this.userId, assignRolesToUser).subscribe(() => {
      this.chosenEvent.emit(this.selectedItems);
      setTimeout(() => {
        this.blockedPanel = false;
      }, 1000);
    });
  }
}
