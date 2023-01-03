import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-header',
  template: `
    <div class="row">
      <div class="col-xl-12">
        <h2 class="page-header">
          {{ heading }}
        </h2>
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <i class="fas fa-dashboard"></i>
            <a [routerLink]="['/dashboard']">Dashboard</a>
          </li>
          <li class="breadcrumb-item active"><i class="fas {{ icon }}"></i> {{ heading }}</li>
        </ol>
      </div>
    </div>
  `,
  imports: [RouterLink],
  standalone: true
})
export class PageHeaderComponent {
  @Input() heading!: string;
  @Input() icon!: string;

  constructor() {}
}
