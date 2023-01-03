import { Component } from '@angular/core';
import { NgbDropdown, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-chat',
  template: `
    <div class="chat-panel card card-default">
      <div class="card-header">
        <i class="fas fa-comments fa-fw"></i>
        Chat
        <div class="pull-right" ngbDropdown>
          <button class="btn btn-secondary btn-sm" ngbDropdownToggle>
            <span class="caret"></span>
          </button>
          <ul class="dropdown-menu dropdown-menu-right">
            <li role="menuitem">
              <a class="dropdown-item"> <i class="fas fa-refresh fa-fw"></i> Refresh</a>
            </li>
            <li role="menuitem">
              <a class="dropdown-item"> <i class="fas fa-check-circle fa-fw"></i> Available</a>
            </li>
            <li role="menuitem">
              <a class="dropdown-item"> <i class="fas fa-times fa-fw"></i> Busy</a>
            </li>
            <li class="divider dropdown-divider"></li>
            <li role="menuitem">
              <a class="dropdown-item"> <i class="fas fa-times fa-fw"></i> Busy </a>
            </li>
            <li>
              <a class="dropdown-item"> <i class="far fa-clock fa-fw"></i> Away </a>
            </li>
            <li class="divider"></li>
            <li>
              <a class="dropdown-item"> <i class="fas fa-sign-out fa-fw"></i> Sign Out </a>
            </li>
          </ul>
        </div>
      </div>
      <!-- /.panel-heading -->
      <div class="card-body">
        <ul class="chat">
          <li class="left clearfix">
            <span class="chat-img pull-left">
              <img alt="User Avatar" class="img-circle" src="http://placehold.it/50/55C1E7/fff" />
            </span>
            <div class="chat-body clearfix">
              <div class="header">
                <strong class="primary-font">Jack Sparrow</strong>
                <small class="pull-right text-muted"> <i class="far fa-clock fa-fw"></i> 12 mins ago </small>
              </div>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis
                ullamcorper ligula sodales.
              </p>
            </div>
          </li>
          <li class="right clearfix">
            <span class="chat-img pull-right">
              <img alt="User Avatar" class="img-circle" src="http://placehold.it/50/FA6F57/fff" />
            </span>
            <div class="chat-body clearfix">
              <div class="header">
                <small class="text-muted"> <i class="far fa-clock fa-fw"></i> 13 mins ago </small>
                <strong class="pull-right primary-font">Bhaumik Patel</strong>
              </div>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis
                ullamcorper ligula sodales.
              </p>
            </div>
          </li>
          <li class="left clearfix">
            <span class="chat-img pull-left">
              <img alt="User Avatar" class="img-circle" src="http://placehold.it/50/55C1E7/fff" />
            </span>
            <div class="chat-body clearfix">
              <div class="header">
                <strong class="primary-font">Jack Sparrow</strong>
                <small class="pull-right text-muted"> <i class="far fa-clock fa-fw"></i> 14 mins ago </small>
              </div>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis
                ullamcorper ligula sodales.
              </p>
            </div>
          </li>
          <li class="right clearfix">
            <span class="chat-img pull-right">
              <img alt="User Avatar" class="img-circle" src="http://placehold.it/50/FA6F57/fff" />
            </span>
            <div class="chat-body clearfix">
              <div class="header">
                <small class="text-muted"> <i class="far fa-clock fa-fw"></i> 15 mins ago </small>
                <strong class="pull-right primary-font">Bhaumik Patel</strong>
              </div>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis
                ullamcorper ligula sodales.
              </p>
            </div>
          </li>
        </ul>
      </div>
      <!-- /.card-body -->
      <div class="card-footer">
        <div class="input-group">
          <input class="form-control input-sm" id="btn-input" placeholder="Type your message here..." type="text" />
          <span class="input-group-btn">
            <button class="btn btn-warning btn-sm" id="btn-chat">Send</button>
          </span>
        </div>
      </div>
      <!-- /.card-footer -->
    </div>
  `,
  styleUrls: ['./chat.component.scss'],
  imports: [NgbDropdown, NgbDropdownToggle],
  standalone: true
})
export class ChatComponent {
  constructor() {}
}
