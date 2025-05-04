import React from "react";
import { Plus } from "lucide-react";

interface MethodOption {
  value: string;
  label: string;
}

interface MethodDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  excludeValue?: string;
  onCreateNew: (type: "from" | "to" | "main") => void;
  fieldType: "from" | "to" | "main";
  options: MethodOption[];
}

export const MethodDropdown: React.FC<MethodDropdownProps> = ({
  value,
  onChange,
  label,
  excludeValue,
  onCreateNew,
  fieldType,
  options,
}) => (
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text font-medium">{label}</span>
    </label>
    <div className="flex gap-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="select select-bordered flex-1"
        required
      >
        <option value="">Select payment method</option>
        {options.map((method) => (
          <option
            key={method.value}
            value={method.value}
            disabled={method.value === excludeValue}
          >
            {method.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="btn btn-square"
        onClick={() => onCreateNew(fieldType)}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  </div>
);