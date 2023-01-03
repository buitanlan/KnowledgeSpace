import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NgbDropdown, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  template: `
    <nav class="navbar navbar-expand-lg fixed-top">
      <a class="navbar-brand ms-4">Knowledge Space </a>
      <button (click)="toggleSidebar()" class="navbar-toggler" type="button">
        <!-- <span class="navbar-toggler-icon"></span> -->
        <i aria-hidden="true" class="fas fa-bars text-muted"></i>
      </button>
      <div class="collapse navbar-collapse">
        <form class="form-inline my-2 my-lg-0">
          <input class="form-control me-sm-2" placeholder="{{ 'Search' }}" type="text" />
        </form>
        <ul class="navbar-nav ms-auto">
          <li class="nav-item dropdown" ngbDropdown>
            <a class="nav-link" ngbDropdownToggle>
              <i class="fas fa-envelope"></i> <b class="caret"></b><span class="sr-only">(current)</span>
            </a>
            <ul class="dropdown-menu-right messages" ngbDropdownMenu>
              <li class="media">
                <img
                  alt="Generic placeholder image"
                  class="d-flex align-self-center me-3"
                  src="http://i.huffpost.com/gadgets/slideshows/461162/slide_461162_6224974_sq50.jpg"
                />
                <div class="media-body">
                  <h5 class="mt-0 mb-1">John Smith</h5>
                  <p class="small text-muted"><i class="far fa-clock"></i> Yesterday at 4:32 PM</p>
                  <p class="last">Lorem ipsum dolor sit amet, consectetur...</p>
                </div>
              </li>
              <li class="media">
                <img
                  alt="Generic placeholder image"
                  class="d-flex align-self-center me-3"
                  src="http://i.huffpost.com/gadgets/slideshows/461162/slide_461162_6224974_sq50.jpg"
                />
                <div class="media-body">
                  <h5 class="mt-0 mb-1">John Smith</h5>
                  <p class="small text-muted"><i class="far fa-clock"></i> Yesterday at 4:32 PM</p>
                  <p class="last">Lorem ipsum dolor sit amet, consecrate...</p>
                </div>
              </li>
              <li class="media">
                <img
                  alt="Generic placeholder image"
                  class="d-flex align-self-center me-3"
                  src="http://i.huffpost.com/gadgets/slideshows/461162/slide_461162_6224974_sq50.jpg"
                />
                <div class="media-body">
                  <h5 class="mt-0 mb-1">John Smith</h5>
                  <p class="small text-muted"><i class="far fa-clock"></i> Yesterday at 4:32 PM</p>
                  <p class="last">Lorem ipsum dolor sit amet, consectetur...</p>
                </div>
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown" ngbDropdown>
            <a class="nav-link" ngbDropdownToggle>
              <i class="fas fa-bell"></i> <b class="caret"></b><span class="sr-only">(current)</span>
            </a>
            <div class="dropdown-menu-right" ngbDropdownMenu>
              <a class="dropdown-item"> {{ 'Pending Task' }} <span class="badge badge-info">6</span> </a>
              <a class="dropdown-item"> {{ 'In queue' }} <span class="badge badge-info"> 13</span> </a>
              <a class="dropdown-item"> {{ 'Mail' }} <span class="badge badge-info"> 45</span> </a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item">
                {{ 'View All' }}
              </a>
            </div>
          </li>
          <li class="nav-item dropdown" ngbDropdown>
            <a class="nav-link" ngbDropdownToggle>
              <i class="fas fa-globe"></i> {{ 'Language' }} <b class="caret"></b>
            </a>
            <div class="dropdown-menu-right" ngbDropdownMenu></div>
          </li>
          <li class="nav-item dropdown me-3" ngbDropdown>
            <a class="nav-link" ngbDropdownToggle> <i class="fas fa-user"></i> {{ userName }} <b class="caret"></b> </a>
            <div class="dropdown-menu-right" ngbDropdownMenu>
              <a class="dropdown-item"> <i class="fas fa-fw fa-user"></i> {{ 'Profile' }} </a>
              <a class="dropdown-item"> <i class="fas fa-fw fa-envelope"></i> {{ 'Inbox' }} </a>
              <a class="dropdown-item"> <i class="fas fa-fw fa-cog"></i> {{ 'Settings' }} </a>
              <a (click)="signout()" [routerLink]="['/login']" class="dropdown-item">
                <i class="fas fa-fw fa-power-off"></i> {{ 'Log Out' }}
              </a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  `,
  styleUrls: ['./header.component.scss'],
  imports: [RouterLink, NgbDropdownToggle, NgbDropdown, NgbDropdownMenu],
  standalone: true
})
export class HeaderComponent implements OnInit {
  public pushRightClass!: string;
  userName: string;
  isAuthenticated = false;
  subscription: Subscription;

  constructor(private readonly router: Router, private readonly authService: AuthService) {
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
    await this.authService.signOut();
  }
}
