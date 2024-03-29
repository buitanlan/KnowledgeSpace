import { Component } from '@angular/core';

@Component({
  selector: 'app-notification',
  template: `
    <div class="card-body">
      <div class="list-group">
        <a class="list-group-item clearfix d-block">
          <i class="fas fa-comment fa-fw"></i> New Comment
          <span class="float-right text-muted small"><em>4 minutes ago</em></span>
        </a>
        <a class="list-group-item clearfix d-block">
          <i class="fas fa-user-friends fa-fw"></i> 3 New Followers
          <span class="float-right text-muted small"><em>12 minutes ago</em></span>
        </a>
        <a class="list-group-item clearfix d-block">
          <i class="fas fa-envelope fa-fw"></i> Message Sent
          <span class="float-right text-muted small"><em>27 minutes ago</em></span>
        </a>
        <a class="list-group-item clearfix d-block">
          <i class="fas fa-tasks fa-fw"></i> New Task
          <span class="float-right text-muted small"><em>43 minutes ago</em></span>
        </a>
        <a class="list-group-item clearfix d-block">
          <i class="fas fa-upload fa-fw"></i> Server Rebooted
          <span class="float-right text-muted small"><em>11:32 AM</em></span>
        </a>
        <a class="list-group-item clearfix d-block">
          <i class="fas fa-bolt fa-fw"></i> Server Crashed!
          <span class="float-right text-muted small"><em>11:13 AM</em></span>
        </a>
        <a class="list-group-item clearfix d-block">
          <i class="fas fa-exclamation-circle fa-fw"></i> Server Not Responding
          <span class="float-right text-muted small"><em>10:57 AM</em></span>
        </a>
        <a class="list-group-item clearfix d-block">
          <i class="fas fa-shopping-cart fa-fw"></i> New Order Placed
          <span class="float-right text-muted small"><em>9:49 AM</em></span>
        </a>
        <a class="list-group-item clearfix d-block">
          <i class="fas fa-money-bill fa-fw"></i> Payment Received
          <span class="float-right text-muted small"><em>Yesterday</em></span>
        </a>
      </div>
      <!-- /.list-group -->
      <a class="btn btn-default btn-block">View All Alerts</a>
    </div>
  `,
  standalone: true
})
export class NotificationComponent {
  constructor() {}
}
