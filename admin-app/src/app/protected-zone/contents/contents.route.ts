import { Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { CommentsComponent } from './comments/comments.component';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';
import { ReportsComponent } from './reports/reports.component';
import { authGuard } from '@app/shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'knowledge-bases',
    component: KnowledgeBaseComponent,
    data: {
      functionCode: 'ContentKnowledgeBase'
    },
    canActivate: [authGuard]
  },
  {
    path: 'comments',
    component: CommentsComponent,
    data: {
      functionCode: 'ContentComment'
    },
    canActivate: [authGuard]
  },
  {
    path: 'reports',
    component: ReportsComponent,
    data: {
      functionCode: 'ContentReport'
    },
    canActivate: [authGuard]
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    data: {
      functionCode: 'ContentCategory'
    },
    canActivate: [authGuard]
  },
  {
    path: '',
    component: KnowledgeBaseComponent,
    data: {
      functionCode: 'ContentKnowledgeBase'
    },
    canActivate: [authGuard]
  }
];
