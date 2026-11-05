import { Component } from '@angular/core';

interface DashboardCard {
  title: string;
  value: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  dashboardCards : DashboardCard[]=[
    {
      title: 'Total Income',
      value: '₹0',
      icon: 'trending_up',
      description: 'Total income for the current month'
    },
    {
      title: 'Total Expenses',
      value: '₹0',
      icon: 'trending_down',  
      description: 'Total expenses for the current month'
    },
    {
      title: 'Net Balance',
      value: '₹0',
      icon: 'account_balance_wallet',  
      description: 'Net balance for the current month'
    },
    {
      title: 'Savings Rate',
      value: '0%',
      icon: 'savings',  
      description: 'Savings percentage'
    }
  ]
}
