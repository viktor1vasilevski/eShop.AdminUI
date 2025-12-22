import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../../core/services/dashboard.service';
import { ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  ordersToday = 0;
  revenueToday = 0;
  totalCustomers = 0;

  ordersPerDayData = [3, 5, 2, 6, 4, 7, 1];
  ordersPerDayLabels = [
    'Dec 16',
    'Dec 17',
    'Dec 18',
    'Dec 19',
    'Dec 20',
    'Dec 21',
    'Dec 22',
  ];
  barChartOptions: ChartOptions = { responsive: true };
  barChartType: ChartType = 'bar';
  barChartLegend = true;

  constructor(private _dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadKPIs();
  }

  loadKPIs() {
    this._dashboardService
      .getOrdersToday()
      .subscribe((res) => (this.ordersToday = res.data?.count ?? 0));
    this._dashboardService
      .getRevenueToday()
      .subscribe((res) => (this.revenueToday = res.data?.amount ?? 0));
    this._dashboardService
      .getTotalCustomers()
      .subscribe((res) => (this.totalCustomers = res.data?.count ?? 0));
  }
}
