import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from '../../../core/components/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import { UsersService } from '../../../core/services/users.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { NotificationService } from '../../../core/services/notification.service';

export interface SubategoryRequest {
  skip: number;
  take: number;
  sortDirection: SortOrder;
  sortBy: string;
  name: string;
  categoryId: string;
}

@Component({
  selector: 'app-user-list',
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  subcategoryRequest: SubategoryRequest = {
    skip: 0,
    take: 10,
    sortDirection: SortOrder.Descending,
    sortBy: 'created',
    name: '',
    categoryId: '',
  };

  users: any[] = [];
  constructor(private _userService: UsersService,
    private _errorHandlerService: ErrorHandlerService,
    private _notificationService: NotificationService
  ) {}


  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this._userService.getUsers().subscribe({
      next: (response: any) => {
        if(response && response.success && response.data){
          this.users = response.data;
        } else {
          this._notificationService.error(response.message);
        }
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
        
      }
    })
  }

  toggleSortOrder(sortedBy: string) {
    // if (this.subcategoryRequest.sortBy === sortedBy) {
    //   this.subcategoryRequest.sortDirection =
    //     this.subcategoryRequest.sortDirection === SortOrder.Ascending
    //       ? SortOrder.Descending
    //       : SortOrder.Ascending;
    // } else {
    //   this.subcategoryRequest.sortBy = sortedBy;
    //   this.subcategoryRequest.sortDirection = SortOrder.Ascending;
    // }
    // this.loadSubcategories();
  }
}
