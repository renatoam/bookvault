import type { PropsWithChildren } from "react";
import { MenuDrawer } from "../MenuDrawer";
import { Footer } from "../Footer";

export default function Layout(props: Readonly<PropsWithChildren>) {
  return (
    <main className="flex flex-col min-h-screen">
      <MenuDrawer />
      <article id="content" className="flex-1 flex place-content-center">
        {props.children}
      </article>
      <Footer />
    </main>
  )
}
