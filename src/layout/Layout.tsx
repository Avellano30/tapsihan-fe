import { AppShell, Box, Burger, Button, Group, Image, Indicator, NavLink, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Logo from '/butch_logo.jpg';
import {  IconSettings, IconListDetails, IconFriends, IconPackage } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { endpoint } from '../main';

interface Cart {
    user: User;
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
}

interface Product {
    productName: string;
    description: string;
    price: number;
    stocks: number;
    image: string;
}

const navData = [
    { icon: IconPackage, label: "Products", href: "/products" },
    { icon: IconListDetails, label: "Orders", href: "/orders" },
    { icon: IconFriends, label: "Users", href: "/users" },
    { icon: IconSettings, label: "Settings", href: "/settings" },
]

export default function Layout({ children }: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();
    const currentIndex = Number(localStorage.getItem("index")) || 0;
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Cart[]>([]);

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

    const items = navData.map((item, index) => (
        <NavLink
            // href={item.href}
            key={item.label}
            active={index === currentIndex}
            label={item.label}
            // description={item.description}
            // rightSection={item.rightSection}
            leftSection={<item.icon size="1.5rem" stroke={1.5} />}
            onClick={() => { localStorage.setItem("index", String(index)), toggle(), navigate(item.href) }}
            color="#940e0e"
            fw={500}
            style={{ borderRadius: 10 }}
            mb={5}
        />
    ));

    const pendingOrders = orders.filter((order) => order.items.some((item) => item.status === "toship"));
    const hasPendingOrders = pendingOrders.length > 0;
    return (
        <AppShell
            layout="alt"
            // header={{ height: 60 }}
            // footer={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            aside={{ width: 300, breakpoint: 'md', collapsed: { desktop: false, mobile: true } }}
            padding="md"
        >
            {/* <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                </Group>
            </AppShell.Header> */}
            <AppShell.Navbar p="md">
                <Group>
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Image src={Logo} h={30} w={30} />
                    <Text className="text-center" fw={700}>Butch Native Lechon</Text>
                </Group>
                <Box className="border-t-2 my-3 pt-4 border-black">
                    {items}
                </Box>
            </AppShell.Navbar>
            <AppShell.Main>
                {children}
            </AppShell.Main>
            <AppShell.Aside p="md">
                <Indicator inline processing color="green" size={hasPendingOrders ? 12 : 0}>
                    <Text className="text-center" fw={700}>Pending Orders</Text>
                </Indicator>
                <Box className="border-t-2 my-3 pt-4 border-black">
                    {pendingOrders.map((order, orderIndex) => (
                        <Box key={orderIndex} className='border-b-2 pb-2 mb-2'>
                            <Text fw={'bold'}>
                                {order.user?.username.charAt(0).toUpperCase() + order.user?.username.slice(1)}
                            </Text>
                            {order.items.map((item, itemIndex) =>
                                item.status === 'toship' ? (
                                    <Text key={itemIndex}>
                                        ×{item.quantity} {item.product.productName}
                                    </Text>
                                ) : null
                            )}
                            <Button h={20} py={4} onClick={() => { localStorage.setItem('index', "1"), toggle(), navigate('/orders') }} color='#940e0e'>Check</Button>
                        </Box>
                    ))}
                </Box>
            </AppShell.Aside>
        </AppShell>
    );
}