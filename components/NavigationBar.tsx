'use client';

import { COMPANY_NAME } from "@/config";
import { LocaleSwitcher, Logo } from "@components";
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
    NavbarItem
} from "@heroui/react";
import { useMe, useSignOut } from "@hooks";
import { getPath } from "@lib";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export function NavigationBar() {
    const { data: user } = useMe();
    const { mutate: logOut } = useSignOut();
    const pathname = usePathname();
    const t = useTranslations("navbar");
    const isActive = (path: string) => pathname?.startsWith(path);
    const isLoginScreen = !user;
    return (
        <Navbar position="static" className="">

            <NavbarBrand className="flex items-center gap-2">
                <Logo />
                <p className="font-bold text-inherit text-lg">{COMPANY_NAME}</p>
            </NavbarBrand>

            {!isLoginScreen &&
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <NavbarItem isActive={isActive(getPath().DASHBOARD)}>
                        <Link color="foreground" href={getPath().DASHBOARD} aria-current={isActive(getPath().DASHBOARD) ? "page" : undefined}>
                            {t("pages.dashboard")}
                        </Link>
                    </NavbarItem>
                    <NavbarItem isActive={isActive(getPath().HOTELS)}>
                        <Link color="foreground" href={getPath().HOTELS} aria-current={isActive(getPath().HOTELS) ? "page" : undefined}>
                            {t("pages.hotels")}
                        </Link>
                    </NavbarItem>
                </NavbarContent>
            }
            <NavbarContent as="div" justify="end" className="gap-2">
                <NavbarItem>
                    <LocaleSwitcher />
                </NavbarItem>
                {!isLoginScreen &&
                    <NavbarItem>
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <Avatar
                                    as="button"
                                    isBordered
                                    className="transition-transform focus:outline focus:outline-offset-2 focus:outline-secondary"
                                    name={user.name}
                                    size="md"
                                    src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.name}`}
                                    alt={t("image_alt", { name: user.name })}
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Profile Actions" variant="flat">
                                <DropdownItem key="profile" className="h-14 gap-2" role="menuitem">
                                    <p className="font-semibold text-sm">{t("profile_header", { name: user.name })}</p>
                                </DropdownItem>
                                <DropdownItem key="settings" role="menuitem">
                                    {t("settings")}
                                </DropdownItem>
                                <DropdownItem key="logout" color="danger" role="menuitem" onPress={() => logOut()}>
                                    {t("logout")}
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </NavbarItem>
                }
            </NavbarContent>

        </Navbar>
    );
}
