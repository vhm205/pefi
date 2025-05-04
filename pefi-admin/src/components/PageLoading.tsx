import { Loading } from "./Loading";

export function PageLoading() {
  return (
    <div className="space-y-6">
      {/* Show loading state for metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
            <Loading variant="skeleton" rows={2} />
          </div>
        ))}
      </div>

      {/* Show loading state for content */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <Loading variant="skeleton" rows={1} />
        <div className="h-64 mt-4">
          <Loading variant="skeleton" rows={1} />
        </div>
      </div>

      {/* Show loading state for table */}
      <Loading variant="table" rows={5} />
    </div>
  );
}