import axios from "axios";
import { useState } from "react";
import type {
  CreateCustomerModel,
  CustomerModel,
  GetCustomersResponse,
} from "../models/CustomerModel";

export const useCustomersProvider = () => {
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);

  const load = () => {
    setIsLoading(true);
    return axios
      .get<GetCustomersResponse>("http://localhost:3000/customers", {
        params: { page, limit },
      })
      .then(({ data }) => {
        setCustomers(data.customers);
        setTotalCount(data.totalCount);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteCustomer = (id: string) => {
    axios.delete(`http://localhost:3000/customers/${id}`).then(() => {
      if (customers.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        void load();
      }
    });
  };

  // Returns the request so the caller can react to errors (e.g. email already in use)
  const createCustomer = (input: CreateCustomerModel) =>
    axios
      .post<CustomerModel>("http://localhost:3000/customers", input)
      .then(() => load());

  return {
    customers,
    load,
    isLoading,
    deleteCustomer,
    createCustomer,
    page,
    setPage,
    limit,
    setLimit,
    totalCount,
  };
};