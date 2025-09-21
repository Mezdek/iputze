import {
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
} from "@heroui/react";
import { useMe, useSignOut } from "@hooks";
import { getPath } from "@lib";
import { usePathname } from 'next/navigation';
import { Logo } from "./icons/Logo";



export function NavigationBar() {
    const { data: user } = useMe()
    const { mutate: logOut } = useSignOut();
    const pathname = usePathname();
    return (
        <Navbar position="static">
            <NavbarBrand>
                <Logo />
                <p className="font-bold text-inherit">iputze</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem isActive={pathname === "/" + getPath().DASHBOARD}>
                    <Link color="foreground" href={getPath().DASHBOARD}>
                        Dashboard
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={pathname === "/" + getPath().HOTELS}>
                    <Link aria-current="page" color="secondary" href={getPath().HOTELS}>
                        Hotels
                    </Link>
                </NavbarItem>
            </NavbarContent>
            {user && (
                <NavbarContent as="div" justify="end">
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform"
                                color="secondary"
                                name={user.name}
                                size="md"
                                src={user.avatarUrl || "https://i.pravatar.cc/150?u=" + user.name}
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-semibold">Signed in as</p>
                                <p className="font-semibold">{user.name}</p>
                            </DropdownItem>
                            <DropdownItem key="settings">My Settings</DropdownItem>
                            <DropdownItem key="logout" color="danger" onPress={() => logOut()}>
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>)}
        </Navbar>
    );
}


