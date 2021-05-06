import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthlyNewMembersComponent } from './monthly-new-members/monthly-new-members.component';
import { MonthlyNewKnowledgeBasesComponent } from './monthly-new-knowledge-bases/monthly-new-knowledge-bases.component';
import { MonthlyNewCommentsComponent } from './monthly-new-comments/monthly-new-comments.component';



@NgModule({
  declarations: [
    MonthlyNewMembersComponent,
    MonthlyNewKnowledgeBasesComponent,
    MonthlyNewCommentsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class StatisticsModule { }
