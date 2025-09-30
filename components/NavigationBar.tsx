'use client';

import { COMPANY_NAME } from "@/config";
import { JoinHotel, LocaleSwitcher, Logo } from "@components";
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
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function NavigationBar() {
    const { data: user } = useMe();
    const { mutate: logOut } = useSignOut();
    const pathname = usePathname();
    const t = useTranslations("navbar");
    const isActive = (path: string) => pathname?.startsWith(path);
    const isLoginScreen = !user;
    const { push } = useRouter()
    const [joinHotelOpen, setJoinHotelOpen] = useState<boolean>(false)

    return (
        <>
            <Navbar position="static" className="">

                <NavbarBrand className="flex items-center gap-2 cursor-default" onClick={() => { push(getPath().HOME) }}>
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
                                        {t("buttons.settings")}
                                    </DropdownItem>
                                    <DropdownItem key="joinHotel" role="menuitem" onPress={() => setJoinHotelOpen(true)}>
                                        {t("buttons.join")}
                                    </DropdownItem>
                                    <DropdownItem key="logout" color="danger" role="menuitem" onPress={() => logOut()}>
                                        {t("buttons.logout")}
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </NavbarItem>
                    }
                </NavbarContent>
            </Navbar>
            <JoinHotel isOpen={joinHotelOpen} onOpenChange={setJoinHotelOpen} />
        </>
    );
}
