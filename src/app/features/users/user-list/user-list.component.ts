import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import { UsersService } from '../../../core/services/users.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ResponseStatus } from '../../../core/enums/response-status.enum';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { FilterInputComponent } from '../../../shared/components/filter-input/filter-input.component';
import { FilterCardComponent } from '../../../shared/components/filter-card/filter-card.component';
import {
  CustomTableComponent,
  TableSettings,
} from '../../../shared/components/custom-table/custom-table.component';

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
    FilterInputComponent,
    FilterCardComponent,
    CustomTableComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  data: any[] = [];
  settings: TableSettings = {
    header: {
      text: 'Users List',
      icon: 'bi bi-people icon',
      actionButton: {
        text: 'Add User',
        icon: 'bi bi-plus-lg',
        routerLink: '/users/create',
      },
    },
    columns: [
      { field: 'firstName', title: 'First Name', width: '10%' },
      { field: 'lastName', title: 'Last Name', width: '10%' },
      { field: 'username', title: 'Username', width: '10%' },
      { field: 'email', title: 'Email', width: '10%' },
      {
        field: 'created',
        title: 'Created At',
        width: '10%',
        type: 'date',
        sortable: true,
        sortKey: 'created',
      },
      {
        field: 'lastModified',
        title: 'Last Modified At',
        width: '10%',
        type: 'date',
        sortable: true,
        sortKey: 'lastmodified',
      },
      { field: 'actions', title: 'Actions', width: '10%' },
    ],
    pagination: {
      enabled: true,
      itemsPerPageOptions: [5, 15, 30, 100],
    },
  };
  userRequest: UserRequest = {
    skip: 0,
    take: this.settings.pagination?.itemsPerPageOptions?.[0] ?? 10,
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
    public router: Router,
    private cd: ChangeDetectorRef
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
    this._userService.getUsers(this.userRequest).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.data = response.data.map((cat: any) => ({
            ...cat,
            view: () => alert('View ' + cat.name),
            edit: () => this.router.navigate(['categories/edit', cat.id]),
            delete: () => this.showDeleteUser(cat),
          }));
          this.cd.detectChanges();
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

  onSortChange(e: { sortBy: string; sortDirection: SortOrder }): void {
    this.userRequest.sortBy = e.sortBy;
    this.userRequest.sortDirection = e.sortDirection;
    this.currentPage = 1;
    this.userRequest.skip = 0;
    this.loadUsers();
  }

  calculateTotalPages(): void {
    const pages = Math.ceil(this.totalCount / this.userRequest.take);
    this.totalPages = Array.from({ length: pages }, (_, i) => i + 1);
  }

  onFilterChange(): void {
    this.filterChangeSubject.next(JSON.stringify(this.userRequest));
  }

  showDeleteUser(asdas: any) {}

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

  viewOrders(userId: string) {
    this.router.navigate(['/users', userId, 'orders']);
  }
}
