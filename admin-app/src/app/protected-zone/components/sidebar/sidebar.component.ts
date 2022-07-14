import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { Function } from '@app/shared/models/function';
import { AuthService } from '@app/shared/services/auth.service';
import { UserService } from '@app/shared/services/user.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    isActive!: boolean;
    collapsed!: boolean;
    showMenu!: string;
    pushRightClass!: string;
    functions$: Observable<Function[]> = of([]);

    @Output() collapsedEvent = new EventEmitter<boolean>();

    constructor(
        private readonly translate: TranslateService,
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

    changeLang(language: string) {
        this.translate.use(language);
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }
}
