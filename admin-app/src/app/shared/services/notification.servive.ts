import { inject, Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  readonly #confirmationService = inject(ConfirmationService);
  readonly #messageService = inject(MessageService);
  showSuccess(message: string) {
    this.#messageService.add({ severity: 'success', summary: 'Thành công', detail: message });
  }

  showError(message: string) {
    this.#messageService.add({ severity: 'error', summary: 'Lỗi', detail: message });
  }

  showConfirmation(message: string, okCallback: () => any, header?: string) {
    this.#confirmationService.confirm({
      message: message,
      header: header ?? 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => okCallback,
      reject: () => undefined
    });
  }
}
