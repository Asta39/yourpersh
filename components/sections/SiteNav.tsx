"use client";

import { motion } from "motion/react";
import { useRef, useState } from "react";
import { navLinks } from "@/lib/content";

type CursorPosition = { left: number; width: number; opacity: number };

function SiteNav() {
  const [position, setPosition] = useState<CursorPosition>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-3">
      <nav aria-label="Primary" className="pointer-events-auto">
        <ul
          className="relative mx-auto flex w-fit rounded-full border-2 border-foreground bg-background p-1"
          onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
        >
          {navLinks.map((link) => (
            <Tab key={link.href} href={link.href} setPosition={setPosition}>
              {link.label}
            </Tab>
          ))}

          <Cursor position={position} />
        </ul>
      </nav>
    </header>
  );
}

const Tab = ({
  children,
  href,
  setPosition,
}: {
  children: React.ReactNode;
  href: string;
  setPosition: (position: CursorPosition) => void;
}) => {
  const ref = useRef<HTMLLIElement>(null);

  const moveCursor = () => {
    if (!ref.current) return;

    const { width } = ref.current.getBoundingClientRect();
    setPosition({
      width,
      opacity: 1,
      left: ref.current.offsetLeft,
    });
  };

  return (
    <li
      ref={ref}
      onMouseEnter={moveCursor}
      onFocus={moveCursor}
      className="relative z-10 block cursor-pointer px-2 py-1.5 text-xs uppercase text-white mix-blend-difference md:px-5 md:py-3 md:text-base"
    >
      <a
        href={href}
        className="whitespace-nowrap outline-none after:absolute after:inset-0 after:rounded-full focus-visible:after:ring-2 focus-visible:after:ring-background"
      >
        {children}
      </a>
    </li>
  );
};

const Cursor = ({ position }: { position: CursorPosition }) => {
  return (
    <motion.li
      aria-hidden
      animate={position}
      className="absolute z-0 h-7 rounded-full bg-foreground md:h-12"
    />
  );
};

export default SiteNav;
