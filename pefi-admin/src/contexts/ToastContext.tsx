import React, { createContext, useContext, useState, useCallback } from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";
export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  position: ToastPosition;
}

interface ToastContextType {
  showToast: (
    message: string,
    type: ToastType,
    position?: ToastPosition
  ) => void;
  position: ToastPosition;
  setPosition: (position: ToastPosition) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{
  children: React.ReactNode;
  defaultPosition?: ToastPosition;
}> = ({ children, defaultPosition = "top-right" }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [position, setPosition] = useState<ToastPosition>(defaultPosition);

  const showToast = useCallback(
    (message: string, type: ToastType, toastPosition?: ToastPosition) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prevToasts) => [
        ...prevToasts,
        { id, message, type, position: toastPosition || position },
      ]);

      setTimeout(() => {
        setToasts((prevToasts) =>
          prevToasts.filter((toast) => toast.id !== id)
        );
      }, 5000);
    },
    [position]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const getPositionClasses = (pos: ToastPosition): string => {
    switch (pos) {
      case "top-right":
        return "top-4 right-4";
      case "top-left":
        return "top-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "top-center":
        return "top-4 left-1/2 -translate-x-1/2";
      case "bottom-center":
        return "bottom-4 left-1/2 -translate-x-1/2";
      default:
        return "top-4 right-4";
    }
  };

  // Group toasts by position
  const groupedToasts = toasts.reduce((acc, toast) => {
    const pos = toast.position || position;
    if (!acc[pos]) {
      acc[pos] = [];
    }
    acc[pos].push(toast);
    return acc;
  }, {} as Record<ToastPosition, Toast[]>);

  return (
    <ToastContext.Provider value={{ showToast, position, setPosition }}>
      {children}
      {Object.entries(groupedToasts).map(([pos, positionToasts]) => (
        <div
          key={pos}
          className={`fixed z-1000 flex flex-col gap-2 ${getPositionClasses(
            pos as ToastPosition
          )}`}
          style={{ maxWidth: "400px", width: "100%" }}
        >
          {positionToasts.map((toast) => (
            <div
              key={toast.id}
              className={`alert ${
                toast.type === "error"
                  ? "alert-error"
                  : toast.type === "success"
                  ? "alert-success"
                  : toast.type === "warning"
                  ? "alert-warning"
                  : "alert-info"
              } shadow-lg animate-slide-in`}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  {toast.type === "error" && (
                    <AlertCircle className="h-6 w-6" />
                  )}
                  {toast.type === "success" && (
                    <CheckCircle className="h-6 w-6" />
                  )}
                  {toast.type === "info" && <Info className="h-6 w-6" />}
                  <span>{toast.message}</span>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="btn btn-ghost btn-sm"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </ToastContext.Provider>
  );
};
