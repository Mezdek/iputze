'use client';

import { Icons, JoinHotel, LocaleSwitcher } from '@components';
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
} from '@heroui/react';
import { useMe, useSignOut } from '@hooks';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { getPath } from '@/lib/shared/constants/pathes';

export function NavigationBar() {
  const { data: user } = useMe();
  const { mutate: logOut } = useSignOut();
  const pathname = usePathname();
  const t = useTranslations('navbar');

  const isActive = (path: string) => pathname?.startsWith(path);
  const isLoginScreen = !user;
  const { push } = useRouter();
  const [joinHotelOpen, setJoinHotelOpen] = useState<boolean>(false);

  return (
    <>
      <Navbar className="" position="static">
        <NavbarBrand
          className="flex items-center gap-2 cursor-default"
          onClick={() => {
            push(getPath().HOME);
          }}
        >
          <Icons.Logo />
        </NavbarBrand>

        {!isLoginScreen && (
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarItem isActive={isActive(getPath().DASHBOARD)}>
              <Link
                aria-current={
                  isActive(getPath().DASHBOARD) ? 'page' : undefined
                }
                color="foreground"
                href={getPath().DASHBOARD}
              >
                {t('pages.dashboard')}
              </Link>
            </NavbarItem>
          </NavbarContent>
        )}
        <NavbarContent as="div" className="gap-2" justify="end">
          <NavbarItem>
            <LocaleSwitcher />
          </NavbarItem>
          {!isLoginScreen && (
            <NavbarItem>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    alt={t('image_alt', { name: user.name })}
                    as="button"
                    className="transition-transform focus:outline focus:outline-offset-2 focus:outline-secondary"
                    name={user.name}
                    size="md"
                    src={
                      user.avatarUrl ||
                      `https://i.pravatar.cc/150?u=${user.name}`
                    }
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem
                    className="h-14 gap-2"
                    key="profile"
                    role="menuitem"
                  >
                    <p className="font-semibold text-sm">
                      {t('profile_header', { name: user.name })}
                    </p>
                  </DropdownItem>
                  <DropdownItem key="settings" role="menuitem">
                    {t('buttons.settings')}
                  </DropdownItem>
                  <DropdownItem
                    key="joinHotel"
                    role="menuitem"
                    onPress={() => setJoinHotelOpen(true)}
                  >
                    {t('buttons.join')}
                  </DropdownItem>
                  <DropdownItem
                    color="danger"
                    key="logout"
                    role="menuitem"
                    onPress={() => logOut()}
                  >
                    {t('buttons.logout')}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          )}
        </NavbarContent>
      </Navbar>
      <JoinHotel isOpen={joinHotelOpen} onOpenChange={setJoinHotelOpen} />
    </>
  );
}
