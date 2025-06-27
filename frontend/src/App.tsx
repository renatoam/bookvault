import { Link, Outlet } from 'react-router'
import './App.scss'
import { PawPrint } from 'lucide-react'

function App() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="navbar bg-base-100 shadow-sm px-4 gap-4">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            <p>Skoob-Doo</p>
            <PawPrint size={32} />
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><a>My Books</a></li>
            <li><a>Docs</a></li>
          </ul>
        </div>
        <section id="search">
          <label className="input">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input type="search" className="grow" placeholder="Search" />
            <kbd className="kbd kbd-sm">↵</kbd>
          </label>
        </section>
        <div className="dropdown">
          <button tabIndex={0} className="btn btn-ghost">
            Theme
            <svg
              width="12px"
              height="12px"
              className="inline-block h-2 w-2 fill-current opacity-60"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 2048 2048">
              <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
            </svg>
          </button>
          <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box z-1 w-24 p-2 shadow-2xl">
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Light"
                value="light" />
            </li>
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Dark"
                value="dark" />
            </li>
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Cupcake"
                value="cupcake" />
            </li>
          </ul>
        </div>
        <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content bg-base-300 rounded-box z-1 w-24 p-2 shadow-2xl">
          <li>
            <a className="w-full btn btn-sm btn-block btn-ghost justify-start">
              Profile
            </a>
          </li>
          <li className="w-full btn btn-sm btn-block btn-ghost justify-start"><a>Settings</a></li>
          <li className="w-full btn btn-sm btn-block btn-ghost justify-start"><a>Logout</a></li>
        </ul>
      </div>
      </div>
      <article id="content" className="flex-1 flex place-content-center">
        <Outlet />
      </article>
      <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
        <aside>
          <p>Book Vault © {new Date().getFullYear()} - Renato Melo</p>
        </aside>
      </footer>
    </main>
  )
}

export default App
