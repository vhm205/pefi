import { Spinner } from "./Spinner";
import { Skeleton } from "./Skeleton";

interface LoadingProps {
  variant?: "spinner" | "skeleton" | "card" | "table";
  rows?: number;
  text?: string;
}

export function Loading({ variant = "spinner", rows = 3, text }: LoadingProps) {
  if (variant === "spinner") {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Spinner size="lg" className="text-primary" />
        {text && (
          <p className="text-sm text-gray-500 animate-pulse">{text}</p>
        )}
      </div>
    );
  }

  if (variant === "skeleton") {
    return (
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm p-4 space-y-4"
          >
            <Skeleton className="h-40 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <Skeleton className="h-6 w-1/4" />
        </div>
        <div className="divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="p-4 space-y-2">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}