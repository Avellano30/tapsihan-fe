import React, { useEffect, useState } from "react";
import { Select, SimpleGrid, Table, Button, Divider, Text, Box, Flex } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { endpoint } from "../main";

interface Cart {
  user: User | null;
  items: CartItem[];
}

interface User {
  _id: string; // Add _id property to User interface
  username: string;
  email: string;
  address: string;
  contact: string;
}

interface CartItem {
  _id: string; // Add _id property to CartItem interface
  product: Product;
  quantity: number;
  status: string;
  paymentRef: string;
  mop: string;
}

interface Product {
  productName: string;
  description: string;
  price: number;
  stocks: number;
  image: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Cart[]>([]);
  const [searchValue, setSearchValue] = useState("");

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${endpoint}/users/order`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: Cart[] = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 3000); // fetch every 3 seconds

    // Cleanup function to clear the interval
    return () => clearInterval(intervalId);
  }, []);

  // Filter orders based on search value and ensure user is not null
  const filteredOrders = orders.filter((order) =>
    order.user?.username?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const renderOrdersByStatus = (status: string) => {
    const ordersByStatus = filteredOrders.filter((order) =>
      order.items.some((item) => item.status === status)
    );

    return (
      <div>
        {ordersByStatus.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          ordersByStatus.map((order, index) => (
            <div key={index} className="rounded-md border-[#940e0e] border-2 mb-4" >
              <div className="gap-4">
                {order.user && (
                  <div className="">
                    <Table highlightOnHover withColumnBorders>
                      <Table.Tbody>
                        <Table.Tr>
                          <Table.Th ta={"center"} w={150} bg={'#940e0e1a'}>Username</Table.Th>
                          <Table.Td>{order.user.username}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Th ta={"center"} w={150} bg={'#940e0e1a'}>Address</Table.Th>
                          <Table.Td>{order.user.address}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Th ta={"center"} w={150} bg={'#940e0e1a'}>Contact #</Table.Th>
                          <Table.Td>{order.user.contact}</Table.Td>
                        </Table.Tr>
                      </Table.Tbody>
                    </Table>
                  </div>
                )}
                <div className="border-y border-[#940e0e]">
                  <Table highlightOnHover withColumnBorders>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th style={{ textAlign: "center" }} bg={'#940e0e1a'}>Product</Table.Th>
                        <Table.Th style={{ textAlign: "center" }} bg={'#940e0e1a'}>Quantity</Table.Th>
                        <Table.Th style={{ textAlign: "center" }} bg={'#940e0e1a'}>Payment Method</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {order.items
                        .filter((item) => item.status === status)
                        .map((item, itemIndex) => (
                          <Table.Tr key={itemIndex}>
                            <Table.Td style={{ textAlign: "center" }}>
                              {item.product.productName}
                            </Table.Td>
                            <Table.Td style={{ textAlign: "center" }}>
                              {item.quantity}
                            </Table.Td>
                            <Table.Td style={{ textAlign: "center" }}>
                              {item.mop} <br/>
                              {item.mop !== "Cash on Delivery" && item.paymentRef}
                            </Table.Td>
                          </Table.Tr>
                        ))}
                    </Table.Tbody>
                  </Table>
                </div>
              </div>
              <div className="flex justify-center bg-[#940e0e] rounded-b-sm">
                {status === "toship" && (
                  <Button
                    color="#940e0e"
                    radius="lg"
                    w={'100%'}
                    onClick={() =>
                      updateOrderStatus(order.user?._id, order.items, "delivery")
                    }
                  >
                    Mark as Out for Delivery
                  </Button>
                )}
                {status === "delivery" && (
                  <Button
                    color="#940e0e"
                    radius="lg"
                    w={'100%'}
                    onClick={() =>
                      updateOrderStatus(order.user?._id, order.items, "completed")
                    }
                  >
                    Mark as Completed
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  const updateOrderStatus = async (userId: string | undefined, items: CartItem[], newStatus: string) => {
    if (!userId) return;

    const itemIds = items.map((item) => item._id);
    const endpointUrl = newStatus === "delivery" ? `${endpoint}/order/delivery` : `${endpoint}/order/completed`;

    try {
      const response = await fetch(endpointUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, items: itemIds }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      fetchOrders(); // Refresh orders after update
    } catch (error) {
      console.error(`Error updating order status to ${newStatus}:`, error);
    }
  };

  return (
    <>
      <SimpleGrid cols={1} spacing="xs" verticalSpacing="xs" mb="md" style={{ maxWidth: '850px', margin: '0 auto' }}>
        <div style= {{width:"850px"}} className="flex justify-between items-center bg-[#DEE2E6] text-[black] font-bold p-2">
          Orders
          <Select
            variant="filled"
            checkIconPosition="right"
            w={{ base: "100%", sm: "250px" }}
            radius="md"
            rightSection={searchValue ? "" : <IconSearch size={15} />}
            placeholder="Search"
            clearable
            searchable
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            nothingFoundMessage="Nothing found..."
            comboboxProps={{
              transitionProps: { transition: "pop", duration: 200 },
              shadow: "md",
            }}
            data={orders
              .filter((order) => order.user)
              .map((order) => ({
                value: order.user!._id,
                label: order.user!.username,
              }))}
          />
        </div>
      </SimpleGrid>
      <Box className="flex" style={{ display: "flex", justifyContent: "space-between", maxWidth: '850px', width:'850px', margin: '0 auto'}}>
        <Flex direction={"column"} style={{ width: "30%" }}>
          <Divider my="xs" label={<Text fw={"bold"} c={"black"}>TO SHIP</Text>} labelPosition="left" color="black" />
          {renderOrdersByStatus("toship")}
        </Flex>
        <Flex direction={"column"} style={{ width: "30%" }}>
          <Divider my="xs" label={<Text fw={"bold"} c={"black"}>IN TRANSIT</Text>} labelPosition="left" color="black" />
          {renderOrdersByStatus("delivery")}
        </Flex>
        <Flex direction={"column"} style={{ width: "30%" }}>
          <Divider my="xs" label={<Text fw={"bold"} c={"black"}>COMPLETED</Text>} labelPosition="left" color="black" />
          {renderOrdersByStatus("completed")}
        </Flex>
      </Box>

    </>
  );
};

export default Orders;
