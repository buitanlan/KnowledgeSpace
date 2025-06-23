import { Component, OnInit, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CommandAssign } from '@app/shared/models/CommandAssign';
import { FunctionsService } from '@app/shared/services/functions.service';
import { CommandsService } from '@app/shared/services/commands.service';

@Component({
  selector: 'app-commands-assign',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">{{ dialogTitle }}</h4>
      <button type="button" class="close pull-right" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body div-scroll">
      <p-table #dt2 [value]="items" selectionMode="multiple" [(selection)]="selectedItems" [metaKeySelection]="true"
               [responsive]="true">
        <ng-template pTemplate="header">
          <tr>
            <th style="width: 35px">
              <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
            </th>
            <th [pSortableColumn]="'id'">Mã hành động
              <p-sortIcon [field]="'id'"></p-sortIcon>
            </th>
            <th [pSortableColumn]="'name'">Hành động
              <p-sortIcon [field]="'name'"></p-sortIcon>
            </th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-row>
          <tr [pSelectableRow]="row">
            <td>
              <p-tableCheckbox [value]="row"></p-tableCheckbox>
            </td>
            <td>{{ row.id }}</td>
            <td>{{ row.name }}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
    <div class="modal-footer">
      <label *ngIf="selectedItems.length > 0">
        <input type="checkbox" [(ngModel)]="addToAllFunctions" name="addToAllFunctions"> Thêm cho tất cả chức năng

      </label>
      <button type="submit" class="btn btn-success" *ngIf="selectedItems.length > 0" (click)="chooseCommands()">Chọn
      </button>
      &nbsp;
      <button type="button" class="btn btn-default">Đóng</button>
    </div>
  `,
  standalone: true,
  imports: [
    TableModule,
    FormsModule
  ]
})
export class CommandsAssignComponent implements OnInit {
  public blockedPanel = false;
  public items!: any[];
  public selectedItems: any[] = [];
  public dialogTitle!: string;
  public functionId!: string;
  public existingCommands: any[] = [];
  public addToAllFunctions = false;
  private chosenEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private functionsService: FunctionsService,
    private commandsService: CommandsService) {
  }

  ngOnInit() {
    this.loadAllCommands();
  }

  loadAllCommands() {
    this.blockedPanel = true;
    this.commandsService.getAll()
      .subscribe((response: any) => {
        this.items = [];

        const existingCommands = this.existingCommands;
        const notExistingCommands = response.filter((item: any) =>
           existingCommands.indexOf(item.Id) === -1
        );

        this.items = notExistingCommands;
        if (this.selectedItems.length === 0 && this.items.length > 0) {
          this.selectedItems.push(this.items[0]);
        }
        setTimeout(() => { this.blockedPanel = false; }, 1000);
      });
  }


  chooseCommands() {
    this.blockedPanel = true;
    const selectedItemIds: any[] = [];
    this.selectedItems.forEach(element => {
      selectedItemIds.push(element.id);
    });
    const entity = {} as CommandAssign;
    entity.addToAllFunctions = this.addToAllFunctions;
    entity.commandIds = selectedItemIds;

    this.functionsService.addCommandsToFunction(this.functionId, entity).subscribe(() => {
      this.chosenEvent.emit(this.selectedItems);
      setTimeout(() => { this.blockedPanel = false; }, 1000);
    });
  }
}
