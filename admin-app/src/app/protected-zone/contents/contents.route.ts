import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { CommentsComponent } from './comments/comments.component';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';
import { ReportsComponent } from './reports/reports.component';

export const routes: Routes = [
  {
    path: 'knowledge-bases',
    component: KnowledgeBaseComponent
  },
  {
    path: 'comments',
    component: CommentsComponent
  },
  {
    path: 'reports',
    component: ReportsComponent
  },
  {
    path: 'categories',
    component: CategoriesComponent
  },
  {
    path: '',
    component: KnowledgeBaseComponent
  }
];
