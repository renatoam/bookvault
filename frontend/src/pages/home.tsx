import { PawPrint } from "lucide-react";
import { Link } from "react-router";

export default function Home() {
  return (
    <div className="hero bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold flex items-baseline justify-center gap-2">
            <span>Skoob-Doo</span>
            <PawPrint size={48} />
          </h1>
          <p>Your Personal Library</p>
          <p className="py-6">
            Keep track of every story in your journey.
            <br />
            Save books you're reading, wish to read, or have already finished—all in one organized place.
            <br />
            <br />
            Never lose sight of your next great read!
          </p>
          <button className="btn btn-primary p-0">
            <Link className="flex items-center h-full w-full p-2" to="/books/new">
              Start building your collection today
            </Link>
          </button>
        </div>
      </div>
    </div>
  )
}
