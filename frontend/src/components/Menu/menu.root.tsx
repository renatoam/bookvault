import { Link } from "react-router";
import { Search } from "../Search";

export default function Menu() {
  return (
    <ul className="menu items-center px-1 lg:menu-horizontal">
      <li><Link to="/books?page=1">My Books</Link></li>
      <li><Link to="/">Docs</Link></li>
      <li><Search /></li>
    </ul>
  )
}
