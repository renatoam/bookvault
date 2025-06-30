import { UserCircle2 } from "lucide-react";
import { Link } from "react-router";

export default function AccountMenu() {
  return (
    <>
      <button className="btn btn-ghost btn-circle avatar">
        <div className="w-fit flex items-center justify-center">
          <UserCircle2 size={40} />
        </div>
      </button>
      <ul className="dropdown-content bg-base-300 rounded-box z-1 w-24 p-2 shadow-2xl">
        <li>
          <Link to="#" className="btn btn-sm btn-block btn-ghost justify-start">
            Profile
          </Link>
        </li>
        <li className="btn btn-sm btn-block btn-ghost justify-start"><Link to="#">Settings</Link></li>
        <li className="btn btn-sm btn-block btn-ghost justify-start"><Link to="#">Logout</Link></li>
      </ul>
    </>
  )
}
