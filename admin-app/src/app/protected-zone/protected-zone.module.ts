import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ProtectedZoneRoutingModule } from './protected-zone-routing.module';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './components/header/header.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, ProtectedZoneRoutingModule, TranslateModule, NgbDropdownModule],
  declarations: [LayoutComponent, SidebarComponent, HeaderComponent]
})
export class ProtectedZoneModule {}
