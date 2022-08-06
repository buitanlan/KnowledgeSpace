import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories/categories.component';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';
import { CommentsComponent } from './comments/comments.component';
import { ReportsComponent } from './reports/reports.component';
import { ContentsRoutingModule } from './content-routing.module';

@NgModule({
  declarations: [CategoriesComponent, KnowledgeBaseComponent, CommentsComponent, ReportsComponent],
  imports: [CommonModule, ContentsRoutingModule]
})
export class ContentsModule {}
