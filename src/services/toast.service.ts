import { Injectable } from '@angular/core';
import { ToastController, ToastOptions } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { alertCircleOutline, checkmarkCircleOutline, warningOutline } from 'ionicons/icons';

export interface ToastConfig {
  message?: string;
  duration?: number;
  position?: 'top' | 'middle' | 'bottom';
  color?: string;
  header?: string;
  icon?: string;
  cssClass?: string | string[];
  buttons?: Array<{
    text: string;
    role?: string;
    handler?: () => boolean | void;
  }>;
  animated?: boolean;
  translucent?: boolean;
  keyboardClose?: boolean;
  id?: string;
  htmlAttributes?: { [key: string]: any };
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {
    addIcons({ alertCircleOutline, checkmarkCircleOutline, warningOutline });
  }

  async showToast(message: string, config?: ToastConfig): Promise<HTMLIonToastElement> {
    const defaultConfig: ToastOptions = {
      message,
      duration: 2000,
      position: 'top',
      color: 'primary',
      animated: true,
      translucent: false,
      keyboardClose: true,
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel',
        },
      ],
    };

    const toastOptions: ToastOptions = {
      ...defaultConfig,
      ...config,
    };

    const toast = await this.toastController.create(toastOptions);
    await toast.present();
    return toast;
  }

  async showErrorToast(message: string, config?: ToastConfig): Promise<HTMLIonToastElement> {
    const defaultErrorConfig: ToastOptions = {
      message,
      duration: 5000,
      position: 'top',
      color: 'danger',
      header: 'Error',
      icon: 'alert-circle-outline',
      animated: true,
      translucent: false,
      keyboardClose: true,
      cssClass: 'error-toast',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        },
      ],
    };

    const toastOptions: ToastOptions = {
      ...defaultErrorConfig,
      ...config,
    };

    const toast = await this.toastController.create(toastOptions);
    await toast.present();
    return toast;
  }

  async showSuccessToast(message: string, config?: ToastConfig): Promise<HTMLIonToastElement> {
    const defaultSuccessConfig: ToastOptions = {
      message,
      duration: 2500,
      position: 'top',
      color: 'success',
      icon: 'checkmark-circle-outline',
      animated: true,
      translucent: false,
      keyboardClose: true,
      cssClass: 'success-toast',
    };

    const toastOptions: ToastOptions = {
      ...defaultSuccessConfig,
      ...config,
    };

    const toast = await this.toastController.create(toastOptions);
    await toast.present();
    return toast;
  }

  async showWarningToast(message: string, config?: ToastConfig): Promise<HTMLIonToastElement> {
    const defaultWarningConfig: ToastOptions = {
      message,
      duration: 4000,
      position: 'middle',
      color: 'warning',
      icon: 'warning-outline',
      animated: true,
      translucent: false,
      keyboardClose: true,
      cssClass: 'warning-toast',
    };

    const toastOptions: ToastOptions = {
      ...defaultWarningConfig,
      ...config,
    };

    const toast = await this.toastController.create(toastOptions);
    await toast.present();
    return toast;
  }

  async dismissAll(): Promise<void> {
    const activeToast = await this.toastController.getTop();
    if (activeToast) {
      await this.toastController.dismiss();
    }
  }

  async createToast(message: string, config?: ToastConfig): Promise<HTMLIonToastElement> {
    const toastOptions: ToastOptions = {
      message,
      duration: 3000,
      position: 'bottom',
      animated: true,
      ...config,
    };

    return await this.toastController.create(toastOptions);
  }
}
