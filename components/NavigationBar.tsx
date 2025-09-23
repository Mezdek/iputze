'use client';

import {
    Avatar,
    Button,
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
import { usePathname } from "next/navigation";
import { Logo } from "./icons/Logo";

export function NavigationBar() {
    const { data: user } = useMe();
    const { mutate: logOut } = useSignOut();
    const pathname = usePathname();

    const isActive = (path: string) => pathname?.startsWith(path);

    return (
        <Navbar position="static">
            {/* Brand */}
            <NavbarBrand className="flex items-center gap-2">
                <Logo />
                <p className="font-bold text-inherit text-lg">iputze</p>
            </NavbarBrand>

            {/* Main Links */}
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem isActive={isActive(getPath().DASHBOARD)}>
                    <Link color="foreground" href={getPath().DASHBOARD} aria-current={isActive(getPath().DASHBOARD) ? "page" : undefined}>
                        Dashboard
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={isActive(getPath().HOTELS)}>
                    <Link color="foreground" href={getPath().HOTELS} aria-current={isActive(getPath().HOTELS) ? "page" : undefined}>
                        Hotels
                    </Link>
                </NavbarItem>
            </NavbarContent>

            {/* User / Auth Actions */}
            <NavbarContent as="div" justify="end" className="gap-2">
                {user ? (
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                as="button"
                                isBordered
                                className="transition-transform focus:outline focus:outline-offset-2 focus:outline-secondary"
                                name={user.name}
                                size="md"
                                src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.name}`}
                                alt={`Avatar of ${user.name}`}
                            />
                        </DropdownTrigger>

                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="profile" className="h-14 gap-2" role="menuitem">
                                <p className="font-semibold text-sm">Signed in as</p>
                                <p className="font-semibold text-base truncate">{user.name}</p>
                            </DropdownItem>
                            <DropdownItem key="settings" role="menuitem">
                                My Settings
                            </DropdownItem>
                            <DropdownItem key="logout" color="danger" role="menuitem" onPress={() => logOut()}>
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                ) : (
                    <div className="flex gap-2">
                        <Button color="primary">Sign In</Button>
                        <Button color="secondary">Sign Up</Button>
                    </div>
                )}
            </NavbarContent>
        </Navbar>
    );
}
