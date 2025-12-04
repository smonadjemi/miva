"use client";
import { Group, Text } from '@mantine/core';
import classes from './style.module.css';

const links = [
  { link: '', label: 'Manuscript' },
];

export function Navbar() {

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Group>
          <img src="./logo.svg" alt="Logo" width={30} height={30}/>
          <Text fz="lg" fw={500} component="a" href={'./'}>MI-VA</Text>
        </Group>

        <Group>
          <Group ml={50} gap={5} className={classes.links} visibleFrom="xså">
            {items}
          </Group>
        </Group>
      </div>
    </header>
  );
}