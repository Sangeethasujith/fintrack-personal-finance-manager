import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { SettingsComponent } from './features/settings/settings.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TransactionsComponent } from './features/transactions/transactions.component';
import { BudgetsComponent } from './features/budgets/budgets.component';
import { ReportsComponent } from './features/reports/reports.component';
import { CategoriesComponent } from './features/categories/categories.component';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    MainLayoutComponent,
    SettingsComponent,
    DashboardComponent,
    TransactionsComponent,
    BudgetsComponent,
    ReportsComponent,
    CategoriesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule
  ],
  providers: [
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
