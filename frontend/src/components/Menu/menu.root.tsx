import { Link } from "react-router";
import { Search } from "../Search";

export default function Menu() {
  return (
    <ul className="menu items-center px-1 lg:menu-horizontal">
      <li><Link to="/books?page=1">My Books</Link></li>
      <li className="btn btn-primary btn-sm">
        <Link to="/books/new" className="hover:bg-transparent cursor-pointer">New Book</Link>
      </li>
      <li><Search /></li>
    </ul>
  )
}
