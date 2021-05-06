import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories/categories.component';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';
import { CommentsComponent } from './comments/comments.component';
import { ReportsComponent } from './reports/reports.component';



@NgModule({
  declarations: [
    CategoriesComponent,
    KnowledgeBaseComponent,
    CommentsComponent,
    ReportsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ContentsModule { }
