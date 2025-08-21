import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { ToastContainer, type ToastProps } from "../components/Toast";

interface ToastContextType {
  showToast: (
    message: string,
    type: "success" | "error" | "info",
    duration?: number
  ) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info", duration = 3000) => {
      const id =
        Date.now().toString() + Math.random().toString(36).substr(2, 9);

      const newToast: ToastProps = {
        id,
        message,
        type,
        duration,
        onRemove: (toastId: string) => {
          setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
        },
      };

      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}
