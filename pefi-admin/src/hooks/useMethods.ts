import { useQuery } from "@tanstack/react-query";
import { methodService } from "../services/method";

export interface MethodOption {
  value: string;
  label: string;
}

export const useMethods = () => {
  const {
    data: methodsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["methods"],
    queryFn: () => methodService.getAll(),
    select: (data) =>
      data.map((method): MethodOption => ({
        value: method,
        label: method,
      })),
  });

  return {
    methods: methodsData || [],
    isLoading,
    error,
  };
};
