import { Injectable } from '@angular/core';
import { ToastrService, ActiveToast, IndividualConfig } from 'ngx-toastr';
import { ResponseStatus } from '../enums/response-status.enum';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  private showToast(
    method: 'success' | 'error' | 'info',
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

  private info(message: string | null | undefined, options = {}) {
    return this.showToast('info', 'Info', message, options);
  }

  notify(
    type: ResponseStatus,
    message: string | null | undefined,
    options?: Partial<IndividualConfig>
  ) {
    switch (type) {
      case ResponseStatus.Success:
        return this.success(message, options);
      case ResponseStatus.Info:
        return this.info(message, options);
      case ResponseStatus.Created:
        return this.success(message, options);
      case ResponseStatus.ServerError:
        return this.error(message, options);
      default:
        //console.warn('Unknown notification type:', type);
        return;
    }
  }
}
