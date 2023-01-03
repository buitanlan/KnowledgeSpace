import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-stat',
  template: `
    <div class="card text-white bg-{{ bgClass }}">
      <div class="card-header">
        <div class="row">
          <div class="col col-xs-3">
            <i class="fas {{ icon }} fa-5x"></i>
          </div>
          <div class="col col-xs-9 text-right">
            <div class="d-block huge">{{ count }}</div>
            <div class="d-block">{{ label }}</div>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <span class="float-left">View Details {{ data }}</span>
        <a class="float-right card-inverse">
          <span><i class="fas fa-arrow-circle-right"></i></span>
        </a>
      </div>
    </div>
  `,
  standalone: true
})
export class StatComponent {
  @Input() bgClass!: string;
  @Input() icon!: string;
  @Input() count!: number;
  @Input() label!: string;
  @Input() data!: number;
  @Output() event: EventEmitter<any> = new EventEmitter();

  constructor() {}
}
