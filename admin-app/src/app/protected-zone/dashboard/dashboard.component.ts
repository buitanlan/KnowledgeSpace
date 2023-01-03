import { Component } from '@angular/core';
import { routerTransition } from '@app/router.animations';
import { ChatComponent, NotificationComponent, TimelineComponent } from '@app/protected-zone/dashboard/components';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { StatComponent } from '@app/shared/modules/stat/stat.component';

@Component({
  selector: 'app-dashboard',
  template: `
    <div [@routerTransition]>
      <h2 class="text-muted">Dashboard <small>Statistics Overview</small></h2>
      <hr />
      <div class="row">
        <div class="col-xl-3 col-lg-6">
          <app-stat [bgClass]="'primary'" [count]="26" [icon]="'fa-comments'" [label]="'New Comments!'"></app-stat>
        </div>
        <div class="col-xl-3 col-lg-6">
          <app-stat [bgClass]="'warning'" [count]="12" [icon]="'fa-tasks'" [label]="'New task!'"></app-stat>
        </div>
        <div class="col-xl-3 col-lg-6">
          <app-stat [bgClass]="'success'" [count]="124" [icon]="'fa-shopping-cart'" [label]="'New Orders!'"></app-stat>
        </div>
        <div class="col-xl-3 col-lg-6">
          <app-stat [bgClass]="'danger'" [count]="13" [icon]="'fa-ticket-alt'" [label]="'New Tickets!'"></app-stat>
        </div>
      </div>
      <hr />
      <ngb-alert (close)="closeAlert(alert)" *ngFor="let alert of alerts" [type]="alert.type">{{
        alert.message
      }}</ngb-alert>
      <hr />
      <div class="row">
        <div class="col-lg-8">
          <div class="card card-default">
            <div class="card-header"><i class="far fa-clock fa-fw"></i> Responsive Timeline</div>
            <!-- /.card-header -->
            <app-timeline></app-timeline>
            <!-- /.card-body -->
          </div>
          <!-- /.card -->
        </div>
        <!-- /.col-lg-8 -->
        <div class="col-lg-4">
          <div class="card card-default mb-3">
            <div class="card-header"><i class="fas fa-bell fa-fw"></i> Notifications card</div>
            <!-- /.card-header -->
            <app-notification></app-notification>
            <!-- /.card-body -->
          </div>
          <!-- /.card -->

          <app-chat></app-chat>
          <!-- /.card .chat-card -->
        </div>
        <!-- /.col-lg-4 -->
      </div>
    </div>
  `,
  animations: [routerTransition()],
  imports: [ChatComponent, NotificationComponent, NgbAlert, TimelineComponent, StatComponent],
  standalone: true
})
export class DashboardComponent {
  public alerts: Array<any> = [];
  public sliders: Array<any> = [];

  constructor() {
    this.sliders.push(
      {
        imagePath: 'assets/images/slider1.jpg',
        label: 'First slide label',
        text: 'Nulla vitae elit libero, a pharetra augue mollis interdum.'
      },
      {
        imagePath: 'assets/images/slider2.jpg',
        label: 'Second slide label',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      },
      {
        imagePath: 'assets/images/slider3.jpg',
        label: 'Third slide label',
        text: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
      }
    );

    this.alerts.push(
      {
        id: 1,
        type: 'success',
        message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptates est animi quibusdam praesentium quam, et perspiciatis,
                consectetur velit culpa molestias dignissimos
                voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
      },
      {
        id: 2,
        type: 'warning',
        message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptates est animi quibusdam praesentium quam, et perspiciatis,
                consectetur velit culpa molestias dignissimos
                voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
      }
    );
  }

  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }
}
