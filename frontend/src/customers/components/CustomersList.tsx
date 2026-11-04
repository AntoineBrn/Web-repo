import { Pagination, Skeleton, Space } from "antd";
import { useEffect } from "react";
import { useCustomersProvider } from "../providers/useCustomersProvider";
import { AddCustomerButton } from "./AddCustomerButton";
import { CustomerListItem } from "./CustomerListItem";

export const CustomersList = () => {
  const {
    customers,
    deleteCustomer,
    createCustomer,
    isLoading,
    load,
    page,
    setPage,
    limit,
    setLimit,
    totalCount,
  } = useCustomersProvider();

  // Recharge la liste au premier affichage ET à chaque changement de page / taille
  useEffect(() => {
    void load();
  }, [page, limit]);

  return (
    <Space orientation="vertical" style={{ padding: ".25rem .5rem" }}>
      <AddCustomerButton createCustomer={createCustomer} />
      {isLoading ? (
        <Skeleton />
      ) : (
        customers.map((customer) => (
          <CustomerListItem
            key={customer.id}
            customer={customer}
            deleteCustomer={deleteCustomer}
          />
        ))
      )}
      <Pagination
        current={page}
        pageSize={limit}
        total={totalCount}
        showSizeChanger
        pageSizeOptions={[10, 20, 50]}
        onChange={(newPage, newSize) => {
          if (newSize !== limit) {
            setLimit(newSize);
            setPage(1); // changer la taille de page ramène à la page 1
          } else {
            setPage(newPage);
          }
        }}
      />
    </Space>
  );
};