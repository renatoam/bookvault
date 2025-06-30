import { SunMoon } from "lucide-react";
import { useEffect, type ChangeEvent } from "react";

export default function ThemeSwitcher() {
  const initialTheme = localStorage.getItem('theme') ?? 'cupcake'

  const toggleTheme = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    localStorage.setItem('theme', value)
    document.documentElement.setAttribute('data-theme', value);
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, [initialTheme]);

  return (
    <>
      <button className="btn btn-ghost btn-circle">
        <SunMoon />
      </button>
      <ul className="dropdown-content bg-base-300 rounded-box z-1 w-24 p-2 shadow-2xl">
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Light"
            value="light"
            onChange={toggleTheme}
          />
        </li>
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Dark"
            value="dark"
            onChange={toggleTheme}
          />
        </li>
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Cupcake"
            value="cupcake"
            onChange={toggleTheme}
          />
        </li>
      </ul>
    </>
  )
}
