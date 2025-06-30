import { Menu } from "../Menu";
import { Navbar } from "../Navbar";

export default function MenuDrawer() {
  return (
    <header className="drawer">
      <input id="mainMenuDrawer" type="checkbox" className="drawer-toggle" />
      <section className="drawer-content flex flex-col">
        <Navbar />        
      </section>
      <section className="drawer-side">
        <label htmlFor="mainMenuDrawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <nav className="flex-none menu bg-base-200 text-base-content min-h-full w-80 p-4">
          <Menu />
        </nav>
      </section>
    </header>
  )
}
