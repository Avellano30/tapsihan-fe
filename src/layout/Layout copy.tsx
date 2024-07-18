import { Anchor, AppShell, Burger, Group, NavLink, ScrollArea, Text } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { IconBuildingStore, IconLogout2, IconSettings2, IconTruckDelivery, IconUsers } from "@tabler/icons-react"

const navData = [
    { icon: IconTruckDelivery, label: "Orders", href: "/orders" },
    { icon: IconBuildingStore, label: "Products", href: "/products" },
    { icon: IconUsers, label: "Users", href: "/users" },
    { icon: IconSettings2, label: "Settings", href: "/settings" },
]

export default function Layout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();

    const [opened, { toggle }] = useDisclosure();
    const { height } = useViewportSize();
    const currentIndex = Number(localStorage.getItem("index")) || 0;

    const items = navData.map((item, index) => (
        <NavLink
            // href={item.href}
            key={item.label}
            active={index === currentIndex}
            label={item.label}
            // description={item.description}
            // rightSection={item.rightSection}
            leftSection={<item.icon size="1.5rem" stroke={1.5} />}
            onClick={() => {localStorage.setItem("index", String(index)), toggle(),navigate(item.href)}}
            color=""
            fw={500}
            style={{ borderRadius: 10 }}
            mb={5}
        />
    ));

    
    return (
        <AppShell
            header={{ height: { base: 65, md: 65, lg: 65 } }}
            navbar={{
                width: { base: 275, md: 275, lg: 275 },
                breakpoint: "sm",
                collapsed: { mobile: !opened },
            }}
        // padding="md"
        >
            <ScrollArea type="always">
                <AppShell.Header bg={"black"}>
                    <Group h="100%" px="md">
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" color="white" />
                        {/* <MantineLogo size={30} /> */}
                        <Anchor href="/home">
                        {/* <Image src="" alt="Butch Native Lechon" className="h-8" /> */}
                        BUTCH NATIVE LECHON
                        </Anchor>
                    </Group>
                </AppShell.Header>
                <AppShell.Navbar p="md">
                    <Text className="text-center" fw={700}>Welcome!</Text>
                    <ScrollArea.Autosize type="scroll" className="border-y-2 my-4 border-black">
                        <AppShell.Section grow my="md" mih={height - 236}>
                            {items}
                        </AppShell.Section>
                    </ScrollArea.Autosize>
                    <AppShell.Section className="">
                        <NavLink
                            href="/"
                            active={true}
                            label={"Sign Out"}
                            // description={item.description}
                            // rightSection={item.rightSection}
                            leftSection={<IconLogout2 size="1.5rem" stroke={1.5} />}
                            onClick={() => { 
                                localStorage.removeItem("session"),
                                localStorage.removeItem("index"), 
                                navigate("/") 
                            }}
                            color="#000"
                            fw={500}
                            style={{ borderRadius: 10, width: "100%"}}
                            mb={5}
                        />
                    </AppShell.Section>
                </AppShell.Navbar>
                <AppShell.Main>
                    <ScrollArea type="auto" h={height - 65} scrollbars="y" p="md">
                        {children}
                    </ScrollArea>
                </AppShell.Main>
            </ScrollArea>
        </AppShell>
    );
}