import { Home, LibraryBig, Menu, Settings } from "lucide-react";
import { Link } from "react-router";

export default function Dock() {
  return (
    <div className="dock dock-md lg:hidden">
      <Link to="/">
        <Home />
        <span className="dock-label">Home</span>
      </Link>
      
      <Link to="/menu">
        <Menu />
        <span className="dock-label">Menu</span>
      </Link>
      
      <Link to="/books">
        <LibraryBig />
        <span className="dock-label">Filter</span>
      </Link>
      
      <Link to="/account">
        <Settings />
        <span className="dock-label">Settings</span>
      </Link>
    </div>
  )
}
