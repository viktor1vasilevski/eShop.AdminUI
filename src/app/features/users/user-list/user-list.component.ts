import { Component, OnInit, ResourceStatus } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import { UsersService } from '../../../core/services/users.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ResponseStatus } from '../../../core/enums/response-status.enum';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { PaginationComponent } from '../../../core/components/pagination/pagination.component';

export interface UserRequest {
  skip: number;
  take: number;
  sortDirection: SortOrder;
  sortBy: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PaginationComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  userRequest: UserRequest = {
    skip: 0,
    take: 10,
    sortDirection: SortOrder.Descending,
    sortBy: 'created',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
  };

  private filterChangeSubject = new Subject<string>();

  totalPages: number[] = [];
  currentPage: number = 1;
  totalCount: number = 0;

  users: any[] = [];
  constructor(
    private _userService: UsersService,
    private _errorHandlerService: ErrorHandlerService,
    private _notificationService: NotificationService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {});

    this.loadUsers();

    this.filterChangeSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.userRequest.skip = 0;
        this.loadUsers();
      });
  }

  loadUsers() {
    debugger;
    this._userService.getUsers(this.userRequest).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.users = response.data;
          this.totalCount =
            typeof response?.totalCount === 'number' ? response.totalCount : 0;
          this.calculateTotalPages();
        } else {
          this._notificationService.notify(
            ResponseStatus.Info,
            response.message
          );
        }
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
      },
    });
  }

  calculateTotalPages(): void {
    const pages = Math.ceil(this.totalCount / this.userRequest.take);
    this.totalPages = Array.from({ length: pages }, (_, i) => i + 1);
  }

  onFilterChange(): void {
    this.filterChangeSubject.next(JSON.stringify(this.userRequest));
  }

  clearFilters(): void {
    this.userRequest.firstName = '';
    this.userRequest.lastName = '';
    this.userRequest.username = '';
    this.userRequest.email = '';
    this.userRequest.skip = 0;
    this.loadUsers();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.userRequest.skip = (page - 1) * this.userRequest.take;
    this.loadUsers();
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.userRequest.take = itemsPerPage;
    this.userRequest.skip = 0;
    this.currentPage = 1;
    this.loadUsers();
  }

  toggleSortOrder(sortedBy: string) {
    if (this.userRequest.sortBy === sortedBy) {
      this.userRequest.sortDirection =
        this.userRequest.sortDirection === SortOrder.Ascending
          ? SortOrder.Descending
          : SortOrder.Ascending;
    } else {
      this.userRequest.sortBy = sortedBy;
      this.userRequest.sortDirection = SortOrder.Ascending;
    }
    this.loadUsers();
  }

  viewOrders(id: string) {
    this.router.navigate(['/users', id, 'orders']);
  }
}
