import { Bookmark, BookOpenText, Check, Frown } from "lucide-react"
import { useFindBooks } from "../hooks/useFindBooks"
import { Fragment } from "react"
import { Link } from "react-router"

export default function Books() {
  const { data: books, isLoading, isError, refetch } = useFindBooks()

  const openModal = (id: string) => {
    const modal = document.getElementById(`detailsModal-${id}`) as HTMLDialogElement | null
    modal?.showModal()
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
    <section className="flex flex-wrap gap-4 p-4 justify-center h-fit">
      {books.map(book => (
        <Fragment key={book.id}>
          <div className="card card-border bg-base-100 w-96 shadow-sm h-fit">
            <div className="card-body">
              <header className="flex justify-between">
                <h2 className="card-title flex justify-between">{book.title}</h2>
                <small className="text-xs">{book.author}</small>  
              </header>
              <div className="divider my-0.5"></div> 
              <p className="line-clamp-3">{book.description}</p>
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
    </section>
  )
}
