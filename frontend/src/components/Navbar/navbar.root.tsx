import { MenuIcon } from "lucide-react";
import { AccountMenu } from "../AccountMenu";
import { Logo } from "../Logo";
import { Menu } from "../Menu";
import { ThemeSwitcher } from "../ThemeSwitcher";

export default function Navbar() {
  return (
    <header className="navbar bg-base-100 shadow-sm px-4 gap-4 w-full">
      <section className="flex-1">
        <Logo />
      </section>
      <label htmlFor="mainMenuDrawer" className="lg:hidden drawer-button btn btn-ghost btn-circle">
        <MenuIcon />
      </label>
      <section className="hidden lg:block">
        <Menu />
      </section>
      <section className="dropdown">
        <ThemeSwitcher />
      </section>
      <section className="dropdown dropdown-end">
        <AccountMenu />
      </section>
    </header>
  )
}
