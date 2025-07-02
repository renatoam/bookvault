import { UserCircle2 } from "lucide-react";
import { Link } from "react-router";
import { useSignOut } from "../../hooks/useSignOut";
import { CustomButton } from "../Button";

export default function AccountMenu() {
  const { mutate } = useSignOut()

  const logout = () => {
    mutate()
  }

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
        <li className="btn btn-sm btn-block btn-ghost justify-start">
          <CustomButton onClick={logout}>Logout</CustomButton>
        </li>
      </ul>
    </>
  )
}
