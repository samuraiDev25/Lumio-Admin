'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CreditCardOutline, ImageOutline, PersonOutline, TrendingUpOutline } from '@jstrommash/ui-kit-lumio';
import s from './NavBar.module.scss';

type NavItem = {
  title: string;
  url: string;
  iconOutline: FC;
};

const navItems: NavItem[] = [
  { title: 'Users list', url: '/users', iconOutline: PersonOutline },
  { title: 'Statistics', url: '/statistics', iconOutline: TrendingUpOutline },
  { title: 'Payments list', url: '/payments', iconOutline: CreditCardOutline },
  { title: 'Posts list', url: '/posts', iconOutline: ImageOutline },
];

const getLinkClassName = (pathname: string | null, url: string) => {
  return pathname === url ? `${s.link} ${s.linkActive}` : s.link;
};

const Navbar: FC = () => {
  const pathname = usePathname();

  return (
    <nav className={s.nav} aria-label="Admin navigation">
      {navItems.map((item) => {
        const Icon = item.iconOutline;

        return (
          <Link key={item.url} className={getLinkClassName(pathname, item.url)} href={item.url}>
            <span className={s.icon}>
              <Icon />
            </span>
            <span className={s.label}>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;
