import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-orders',
  imports: [],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.css',
})
export class UserOrdersComponent implements OnInit {
  userId: string = '';

  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') ?? '';
  }
}
