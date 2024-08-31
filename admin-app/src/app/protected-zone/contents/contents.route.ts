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
      functionCode: 'CONTENT_KNOWLEDGEBASE'
    },
    canActivate: [authGuard]
  },
  {
    path: 'comments',
    component: CommentsComponent,
    data: {
      functionCode: 'CONTENT_COMMENT'
    },
    canActivate: [authGuard]
  },
  {
    path: 'reports',
    component: ReportsComponent,
    data: {
      functionCode: 'CONTENT_REPORT'
    },
    canActivate: [authGuard]
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    data: {
      functionCode: 'CONTENT_CATEGORY'
    },
    canActivate: [authGuard]
  },
  {
    path: '',
    component: KnowledgeBaseComponent,
    data: {
      functionCode: 'CONTENT_KNOWLEDGEBASE'
    },
    canActivate: [authGuard]
  }
];
