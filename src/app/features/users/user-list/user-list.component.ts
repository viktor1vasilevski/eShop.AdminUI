import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from '../../../core/components/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import { UsersService } from '../../../core/services/users.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationType } from '../../../core/enums/notification-type.enum';

export interface UserRequest {
  skip: number;
  take: number;
  sortDirection: SortOrder;
  sortBy: string;
}

@Component({
  selector: 'app-user-list',
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  userRequest: UserRequest = {
    skip: 0,
    take: 10,
    sortDirection: SortOrder.Descending,
    sortBy: 'created',
  };

  users: any[] = [];
  constructor(
    private _userService: UsersService,
    private _errorHandlerService: ErrorHandlerService,
    private _notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    debugger;
    this._userService.getUsers(this.userRequest).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.users = response.data;
        } else {
          this._notificationService.notify(
            NotificationType.Info,
            response.message
          );
        }
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
      },
    });
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
