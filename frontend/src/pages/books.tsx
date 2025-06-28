import { Bookmark, BookOpenText, Check, Frown } from "lucide-react"
import { Fragment, type ChangeEvent } from "react"
import { Link, useSearchParams } from "react-router"
import { useFindBooks } from "../hooks/useFindBooks"
import type { Status } from "../services/findBooks"

const authors = [
  {
    id: 1,
    name: 'Author 1',
    value: 'author1'
  },
  {
    id: 2,
    name: 'Author 2',
    value: 'author2'
  },
  {
    id: 3,
    name: 'None',
    value: 'none'
  },
]

export default function Books() {
  const [searchParams, setSearchParams] = useSearchParams()
  const status = searchParams.get('status') as Status ?? undefined
  const author = searchParams.get('author') ?? undefined
  const sort = searchParams.get('sort') ?? undefined
  const { data: books, isLoading, isError, refetch } = useFindBooks({
    author,
    status,
    sort
  })

  const openModal = (id: string) => {
    const modal = document.getElementById(`detailsModal-${id}`) as HTMLDialogElement | null
    modal?.showModal()
  }

  const handleStatus = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchParams({ status: value })
  }

  const removeStatus = () => {
    const resetParams = new URLSearchParams(searchParams)
    resetParams.delete('status')
    setSearchParams(resetParams)
  }

  const handleAuthor = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    if (value === 'none') {
      const resetParams = new URLSearchParams(searchParams)
      resetParams.delete('author')
      return setSearchParams(resetParams)
    }

    setSearchParams({ author: value })
  }

  const handleSorting = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value

    if (value === 'default') {
      const resetParams = new URLSearchParams(searchParams)
      resetParams.delete('sort')
      return setSearchParams(resetParams)
    }

    setSearchParams({ sort: value })
  }

  const statuses = {
    FINISHED: {
      label: "Finished",
      icon: <Check size={16} />,
      color: "badge-accent"
    },
    WISHLIST: {
      label: "Wishlist",
      icon: <Bookmark size={16} />,
      color: "badge-secondary"
    },
    READING: {
      label: "Reading",
      icon: <BookOpenText size={16} />,
      color: "badge-info"
    }
  }

  if (isLoading) {
    return (
      <section className="flex flex-wrap gap-4 p-4 justify-center">
        {Array(10).fill(null).map((el, index) => (
          <div key={`${el}_${index}`} className="flex w-96 flex-col gap-4">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        ))}
      </section>
    )
  }

  if (!books || isError) {
    return (
      <div className="hero bg-base-200 min-h-full">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold flex items-baseline justify-center gap-2">
              <span>Ooh, snap!</span>
              <span><Frown size={40} /></span>
            </h1>
            <p className="py-6">
              Something went wrong when we were trying to get your books.
            </p>
            <button className="btn btn-primary" onClick={() => refetch()}>Try it again!</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="flex flex-col max-w-11/12 my-8">
      <section className="flex gap-4 items-start justify-between flex-wrap">
        <aside id="filter" className="hidden lg:block min-w-48">
          <fieldset>
            <legend>Filter:</legend>
            <br />
            <div className="divider divider-start">By status</div>
            <form className="filter" id="filterByStatus">
              <input
                className="btn btn-square btn-xs"
                type="reset"
                value="x"
                onClick={removeStatus}
              />
              <input
                className="btn btn-xs btn-info"
                type="radio"
                name="status"
                aria-label="Reading"
                value="READING"
                checked={status === 'READING'}
                onChange={handleStatus}
              />
              <input
                className="btn btn-xs btn-secondary"
                type="radio"
                name="status"
                aria-label="Wishlist"
                value="WISHLIST"
                checked={status === 'WISHLIST'}
                onChange={handleStatus}
              />
              <input
                className="btn btn-xs btn-accent"
                type="radio"
                name="status"
                aria-label="Finished"
                value="FINISHED"
                checked={status === 'FINISHED'}
                onChange={handleStatus}
              />
            </form>
            <br />
            <div className="divider divider-start">By author</div>
            <form className="flex flex-col gap-2" id="filterByAuthor">
              {authors.map(aut => (
                <div key={aut.id} className="flex gap-2 items-center">
                  <input id="author1" type="radio" name="author" className="radio radio-sm" value={aut.value} onChange={handleAuthor} />
                  <label htmlFor="author1">{aut.name}</label>
                </div>
              ))}
            </form>
            <br />
            <div className="divider divider-start">Sort</div>
            <select defaultValue={sort ?? "default"} className="select" onChange={handleSorting}>
              <option value="default">Default</option>
              <option value={"title:asc"}>Title - Asc</option>
              <option value={"title:desc"}>Title - Desc</option>
              <option value={"author:asc"}>Author - Asc</option>
              <option value={"author:desc"}>Author - Desc</option>
            </select>
          </fieldset>
        </aside>
        <article className="flex flex-3/4 flex-wrap gap-4 justify-center h-fit w-4xl">
          {books.length === 0 ? <p className="w-3/4">No book has been found.</p> : books.map(book => (
            <Fragment key={book.id}>
              <div className="card card-border bg-base-100 w-[max(96,100%)] shadow-sm min-h-60 h-fit min-w-[min(16rem,100%)] max-w-96 flex-1/6">
                <div className="card-body">
                  <header className="flex justify-between">
                    <h2 className="card-title flex justify-between">{book.title}</h2>
                    <small className="text-xs">{book.author}</small>  
                  </header>
                  <div className="divider my-0.5"></div> 
                  <p className="line-clamp-3 max-h-fit min-h-20">{book.description}</p>
                  <div className="card-actions justify-star items-end">
                    <div className={`badge badge-outline ${statuses[book.status].color ?? ''}`}>
                      {statuses[book.status].icon}
                      {statuses[book.status].label}
                    </div>
                    <button className="btn btn-sm ml-auto" onClick={() => openModal(book.id)}>Details</button>
                  </div>
                </div>
              </div>
              <dialog id={`detailsModal-${book.id}`} className="modal">
                <div className="modal-box">
                  <header className="flex justify-between">
                    <h3 className="font-bold text-lg">{book.title}</h3>
                    <section className="flex gap-1">
                      <div className={`badge badge-outline ${statuses[book.status].color ?? ''}`}>
                        {statuses[book.status].icon}
                        {statuses[book.status].label}
                      </div>
                      
                    </section>
                  </header>
                  <div className="divider my-0.5"></div>
                  <p>{book.description}</p>
                  <div className="divider my-0.5"></div>
                  <footer className="flex justify-between items-center">
                    <small className="text-xs">{book.author}</small>
                    <small className="text-xs">Press ESC key or click outside to close</small>
                    <button className="btn btn-primary btn-xs p-0">
                      <Link className="flex items-center h-full w-full p-2" to={`/books/${book.id}`}>Edit</Link>
                    </button>
                  </footer>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>
            </Fragment>
          ))}
        </article>
      </section>
    </section>
  )
}
