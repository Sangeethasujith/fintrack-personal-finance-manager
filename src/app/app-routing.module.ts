import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TransactionsComponent } from './features/transactions/transactions.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { BudgetsComponent } from './features/budgets/budgets.component';
import { ReportsComponent } from './features/reports/reports.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'budgets', component: BudgetsComponent },
      { path: 'reports', component: ReportsComponent }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}