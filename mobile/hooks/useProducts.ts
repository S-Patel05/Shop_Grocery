import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Product } from "@/types";

export const useProduct = () => {
  const api = useApi();

  const result = useQuery<Product>({
    queryKey: ["product"],
    queryFn: async () => {
      const { data } = await api.get<Product[]>("/products");
      return data;
    },
  });

  return result;
};
export default useProduct;