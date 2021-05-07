import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthlyNewMembersComponent } from './monthly-new-members/monthly-new-members.component';
import { MonthlyNewKnowledgeBasesComponent } from './monthly-new-knowledge-bases/monthly-new-knowledge-bases.component';
import { MonthlyNewCommentsComponent } from './monthly-new-comments/monthly-new-comments.component';
import { StatisticsRoutingModule } from './statistics-routing.module';



@NgModule({
  declarations: [
    MonthlyNewMembersComponent,
    MonthlyNewKnowledgeBasesComponent,
    MonthlyNewCommentsComponent
  ],
  imports: [
    CommonModule,
    StatisticsRoutingModule
  ]
})
export class StatisticsModule { }
