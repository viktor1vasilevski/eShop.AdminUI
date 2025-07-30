import { Injectable } from '@angular/core';
import { ToastrService, ActiveToast, IndividualConfig } from 'ngx-toastr';
import { NotificationType } from '../enums/notification-type.enum';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  private showToast(
    method: 'success' | 'error',
    title: string,
    message: string | null | undefined,
    options: Partial<IndividualConfig> = {}
  ): ActiveToast<any> | void {
    if (message === null) return;

    return this.toastr[method](message, title, {
      timeOut: 4500,
      positionClass: 'toast-bottom-right',
      ...options,
    });
  }

  private success(message: string | null | undefined, options = {}) {
    return this.showToast('success', 'Success', message, options);
  }

  private error(message: string | null | undefined, options = {}) {
    return this.showToast('error', 'Error', message, options);
  }

  notify(
    type: NotificationType,
    message: string | null | undefined,
    options?: Partial<IndividualConfig>
  ) {
    switch (type) {
      case NotificationType.Success:
        return this.success(message, options);
      case NotificationType.Created:
        return this.success(message, options);
      case NotificationType.ServerError:
        return this.error(message, options);
      default:
        //console.warn('Unknown notification type:', type);
        return;
    }
  }
}
