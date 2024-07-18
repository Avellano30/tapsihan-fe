import { useEffect, useState } from "react";
import { Select, SimpleGrid, Table } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { endpoint } from "../main";

// Define the interface for User
interface User {
  _id: string;
  username: string;
  email: string;
  address: string;
  contact: string;
}

// Define the component
export default function Users() {
  // State to store users and search value with types
  const [users, setUsers] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${endpoint}/users`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching Users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search value
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Create rows for the table
  const rows = filteredUsers.map((user) => (
    <Table.Tr key={user._id}>
      <Table.Td>{user.username}</Table.Td>
      <Table.Td>{user.email}</Table.Td>
      <Table.Td>{user.address}</Table.Td>
      <Table.Td>{user.contact}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <SimpleGrid
        cols={{ base: 1, sm: 1 }}
        spacing={{ base: "xs", sm: "xs" }}
        verticalSpacing={{ base: "xs", sm: "xs" }}
        mb={"md"}
      >
        <div className="flex justify-between items-center bg-[#940e0e1a] text-[#940e0e] font-bold rounded-md p-2">
          Users
          <Select
            variant="filled"
            checkIconPosition="right"
            w={{ base: "100%", sm: "250px" }}
            radius={"md"}
            data={users.map((user) => ({ value: user.username, label: user.username }))}
            rightSection={searchValue ? '' : <IconSearch size={15} />}
            placeholder="Search"
            clearable
            searchable
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            nothingFoundMessage="Nothing found..."
            comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 }, shadow: 'md' }}
          />
        </div>
      </SimpleGrid>

      <div className="border-2 rounded-md border-[#940e0e]">
        <Table highlightOnHover striped>
          <Table.Thead>
            <Table.Tr bg={"#940e0e1a"}>
              <Table.Th ta={"center"}>Username</Table.Th>
              <Table.Th ta={"center"}>Email</Table.Th>
              <Table.Th ta={"center"}>Address</Table.Th>
              <Table.Th ta={"center"}>Contact No.</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody ta={"center"}>{rows}</Table.Tbody>
        </Table>
      </div>
    </>
  );
}

