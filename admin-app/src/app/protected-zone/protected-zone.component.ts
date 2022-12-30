import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { HeaderComponent } from '@app/protected-zone/components/header/header.component';
import { SidebarComponent } from '@app/protected-zone/components/sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  template: `
    <app-header></app-header>
    <app-sidebar (collapsedEvent)="receiveCollapsed($event)"></app-sidebar>
    <section [ngClass]="{ collapsed: collapedSideBar }" class="main-container">
      <router-outlet></router-outlet>
    </section>
  `,
  styleUrls: ['./protected-zone.component.scss'],
  imports: [RouterOutlet, NgClass, HeaderComponent, SidebarComponent],
  standalone: true
})
export class ProtectedZoneComponent {
  collapedSideBar = false;

  constructor() {}

  receiveCollapsed($event: boolean) {
    this.collapedSideBar = $event;
  }
}
