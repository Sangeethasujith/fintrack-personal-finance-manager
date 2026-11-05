import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  navigationItems=[
    {
      label : 'Dashboard',
      icon : 'dashboard',
      route : '/dashboard',
    },
    {
      label: 'Transactions',
      icon: 'receipt_long',
      route: '/transactions'
    },
    {
      label: 'Categories',
      icon: 'category',
      route: '/categories'
    },
    {
      label: 'Budgets',
      icon: 'account_balance_wallet',
      route: '/budgets'
    },
    {
      label: 'Reports',
      icon: 'bar_chart',
      route: '/reports'
    }
  ]
}
