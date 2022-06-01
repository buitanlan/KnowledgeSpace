import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    public pushRightClass!: string;
    userName: string;
    isAuthenticated = false;
    subscription: Subscription;

    constructor(
        private readonly translate: TranslateService,
        private readonly router: Router,
        private readonly authService: AuthService
    ) {
        this.subscription = this.authService.authNavStatus$.subscribe((status) => (this.isAuthenticated = status));
        this.userName = this.authService.name;
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        this.pushRightClass = 'push-right';
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

    async signout() {
        await this.authService.signout();
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
}
