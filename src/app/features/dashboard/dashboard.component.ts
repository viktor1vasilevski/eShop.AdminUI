import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../core/services/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  ordersToday = 0;
  revenueToday = 0;
  totalCustomers = 0;

  constructor(private _dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadKPIs();
  }

  loadKPIs() {
    // Fetch all 3 KPIs in parallel
    this._dashboardService.getOrdersToday().subscribe((res) => {
      this.ordersToday = res.data?.count ?? 0;
    });

    this._dashboardService.getRevenueToday().subscribe((res) => {
      this.revenueToday = res.data?.amount ?? 0;
    });

    this._dashboardService.getTotalCustomers().subscribe((res) => {
      this.totalCustomers = res.data?.count ?? 0;
    });
  }
}
