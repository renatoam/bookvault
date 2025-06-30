import { useLocation, useNavigate, useSearchParams } from "react-router"
import type { Status } from "../../services/findBooks"
import { queryClient } from "../../config/tanstack"
import { useCallback, useMemo, useRef, type KeyboardEvent } from "react"

export const useSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchRef = useRef<HTMLInputElement>(null)
  const location = useLocation()
  const navigate = useNavigate()

  const status = searchParams.get('status') as Status ?? undefined
  const author = searchParams.get('author') ?? undefined
  const sort = searchParams.get('sort') ?? undefined
  const page = searchParams.get('page') ?? undefined
  const limit = searchParams.get('limit') ?? undefined
  const q = searchParams.get('q') ?? undefined
  
  const initialFilter = useMemo(() => ({
    author,
    status,
    sort,
    page,
    limit,
    q
  }), [
    author,
    status,
    sort,
    page,
    limit,
    q
  ])

  const executeSearch = useCallback((event: KeyboardEvent) => {
    const key = event.key
    const value = (event.target as HTMLInputElement).value

    if (key.toLowerCase() === 'enter') {
      setSearchParams({ q: value })
      queryClient.invalidateQueries({ queryKey: ['books', initialFilter] })
      
      if (searchRef.current) searchRef.current.value = ''
      if (!location.pathname.includes('/books')) {
        navigate(`/books?${new URLSearchParams({ q: value }).toString()}`);
      }
    }

  }, [initialFilter, setSearchParams, location.pathname, navigate])

  return {
    searchRef,
    executeSearch
  }
}
