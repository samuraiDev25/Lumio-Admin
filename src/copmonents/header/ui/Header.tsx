'use client';

import s from './Header.module.scss';
import Link from 'next/link';
import {Container, Typography} from "@jstrommash/ui-kit-lumio";
import {HeaderSelect} from "@/copmonents/header/ui/headerSelect/HeaderSelect";

export const Header = () => {

  return (
      <header className={s.header}>
        <Container>
          <div className={s.headerWrapper}>
            <Link href={'/'}>
              <Typography variant={'large'} as={'span'} className={s.logo}>
                L U M I O
                <span className={s.admin}>
                Super<strong>Admin</strong>
              </span>
              </Typography>
            </Link>

            <div className={s.selectBox}>
              <HeaderSelect />
            </div>
          </div>
        </Container>
      </header>
  );
};
