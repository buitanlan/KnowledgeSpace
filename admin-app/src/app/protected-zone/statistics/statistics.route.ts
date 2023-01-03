import { Routes } from '@angular/router';
import { MonthlyNewCommentsComponent } from './monthly-new-comments/monthly-new-comments.component';
import { MonthlyNewKnowledgeBasesComponent } from './monthly-new-knowledge-bases/monthly-new-knowledge-bases.component';
import { MonthlyNewMembersComponent } from './monthly-new-members/monthly-new-members.component';

export const routes: Routes = [
  {
    path: 'monthly-new-knowledge-bases',
    component: MonthlyNewKnowledgeBasesComponent
  },
  {
    path: 'monthly-new-comments',
    component: MonthlyNewCommentsComponent
  },
  {
    path: 'monthly-new-members',
    component: MonthlyNewMembersComponent
  },
  {
    path: '',
    component: MonthlyNewKnowledgeBasesComponent
  }
];
