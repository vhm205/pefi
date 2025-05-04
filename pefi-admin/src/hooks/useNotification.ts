import { useToast, ToastPosition } from "../contexts/ToastContext";

interface NotificationOptions {
  position?: ToastPosition;
}

export const useNotification = () => {
  const { showToast, position: defaultPosition, setPosition } = useToast();

  return {
    success: (message: string, options?: NotificationOptions) =>
      showToast(message, "success", options?.position),
    error: (message: string, options?: NotificationOptions) =>
      showToast(message, "error", options?.position),
    info: (message: string, options?: NotificationOptions) =>
      showToast(message, "info", options?.position),
    warning: (message: string, options?: NotificationOptions) =>
      showToast(message, "warning", options?.position),
    setDefaultPosition: (position: ToastPosition) => setPosition(position),
    defaultPosition,
  };
};
