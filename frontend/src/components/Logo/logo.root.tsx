import { PawPrint } from "lucide-react";
import { Link } from "react-router";

export default function Logo() {
  return (
    <Link to="/" className="btn btn-ghost text-xl">
      <h1>Skoob-Doo</h1>
      <PawPrint size={32} />
    </Link>
  )
}
