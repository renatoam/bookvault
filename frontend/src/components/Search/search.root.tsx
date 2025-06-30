import { SearchIcon } from "lucide-react"
import { useSearch } from "./search.hooks"

export default function Search() {
  const { searchRef, executeSearch } = useSearch()

  return (
    <section id="search">
      <label className="input">
        <SearchIcon />
        <input
          ref={searchRef}
          type="search"
          className="grow"
          placeholder="Search"
          onKeyDown={executeSearch}
        />
        <kbd className="kbd kbd-sm">↵</kbd>
      </label>
    </section>
  )
}
