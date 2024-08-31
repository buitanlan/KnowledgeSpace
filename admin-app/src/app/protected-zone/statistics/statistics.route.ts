import { Routes } from '@angular/router';
import { MonthlyNewCommentsComponent } from './monthly-new-comments/monthly-new-comments.component';
import { MonthlyNewKnowledgeBasesComponent } from './monthly-new-knowledge-bases/monthly-new-knowledge-bases.component';
import { MonthlyNewMembersComponent } from './monthly-new-members/monthly-new-members.component';
import { authGuard } from '@app/shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'monthly-new-knowledge-bases',
    component: MonthlyNewKnowledgeBasesComponent,
    data: {
      functionCode: 'StatisticMonthlyNewMember'
    },
    canActivate: [authGuard]
  },
  {
    path: 'monthly-new-comments',
    component: MonthlyNewCommentsComponent,
    data: {
      functionCode: 'StatisticMonthlyComment'
    },
    canActivate: [authGuard]
  },
  {
    path: 'monthly-new-members',
    component: MonthlyNewMembersComponent,
    data: {
      functionCode: 'StatisticMonthlyNewMember'
    },
    canActivate: [authGuard]
  },
  {
    path: '',
    component: MonthlyNewKnowledgeBasesComponent,
    data: {
      functionCode: 'StatisticMonthlyNewKnowledgeBase'
    },
    canActivate: [authGuard]
  }
];
