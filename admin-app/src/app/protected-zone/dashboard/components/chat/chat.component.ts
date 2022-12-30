import { Component } from '@angular/core';
import { NgbDropdown, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [NgbDropdown, NgbDropdownToggle],
  standalone: true
})
export class ChatComponent {
  constructor() {}
}
