import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Function } from '@app/shared/models/function';
import { AuthService } from '@app/shared/services/auth.service';
import { UserService } from '@app/shared/services/user.service';
import { AsyncPipe, NgClass, NgForOf } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  template: `
    <nav [ngClass]="{ sidebarPushRight: isActive, collapsed: collapsed }" class="sidebar">
      <div class="list-group">
        <div class="nested-menu" *ngFor="let item of functions$ | async">
          <a class="list-group-item" (click)="addExpandClass(item.id)">
            <i class="fa {{ item.icon }}"></i>&nbsp;
            <span>{{ item.name }}</span>
          </a>
          <li class="nested" [class.expand]="showMenu === item.id" *ngFor="let subItem of item.children">
            <ul class="submenu">
              <li>
                <a routerLink="{{ subItem.url }}" [routerLinkActive]="['router-link-active']">
                  <i class="fa {{ subItem.icon }}"></i>&nbsp;
                  <span>{{ subItem.name }}</span>
                </a>
              </li>
            </ul>
          </li>
        </div>
      </div>
      <div (click)="toggleCollapsed()" [ngClass]="{ collapsed: collapsed }" class="toggle-button">
        <i class="fas fa-fw fa-angle-double-{{ collapsed ? 'right' : 'left' }}"></i>&nbsp;
        <span>{{ 'Collapse Sidebar' }}</span>
      </div>
    </nav>
  `,
  styleUrls: ['./sidebar.component.scss'],
  imports: [NgClass, AsyncPipe, RouterLinkActive, NgForOf, RouterLink],
  standalone: true
})
export class SidebarComponent implements OnInit {
  isActive!: boolean;
  collapsed!: boolean;
  showMenu!: string;
  pushRightClass!: string;
  functions$: Observable<Function[]> = of([]);

  @Output() collapsedEvent = new EventEmitter<boolean>();

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  ngOnInit() {
    this.isActive = false;
    this.collapsed = false;
    this.showMenu = '';
    this.pushRightClass = 'push-right';
    this.loadMenu();
  }

  loadMenu() {
    const profile = this.authService.getProfile();
    if (profile) {
      this.functions$ = this.userService.getMenuByUser(profile.sub);
    }
  }

  eventCalled() {
    this.isActive = !this.isActive;
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
    this.collapsedEvent.emit(this.collapsed);
  }

  isToggled(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const dom: Element = document.querySelector('body')!;
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  rltAndLtr() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle('rtl');
  }

  onLoggedout() {
    localStorage.removeItem('isLoggedin');
  }
}
