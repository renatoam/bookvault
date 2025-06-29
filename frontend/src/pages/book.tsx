import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import { useCreateBook } from "../hooks/useCreateBook"
import { useBookValidation } from "../hooks/useBookValidation"
import { Loader } from "lucide-react"
import type { Book as BookType } from "../types/book"
import { useParams } from "react-router"
import { useGetBook } from "../hooks/useGetBook"
import { useUpdateBook } from "../hooks/useUpdateBook"

const formInitialState: BookType = {
  title: '',
  author: '',
  description: '',
  status: 'WISHLIST'
}

export default function Book() {
  const { id } = useParams()
  
  const { data: book, isLoading } = useGetBook(id)

  const {
    mutate: createBookMutate,
    isPending: isCreatePending,
    isSuccess: isCreateSuccess
  } = useCreateBook()

  const {
    mutate: updateBookMutate,
    isPending: isUpdatePending,
  } = useUpdateBook()
  
  const { validateField, validateForm, errors } = useBookValidation()
  const [bookFormData, setBookFormData] = useState<BookType>(book ?? formInitialState)
  const formRef = useRef<HTMLFormElement>(null)

  console.log({ book })

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target.value
    const name = event.target.name as keyof Omit<BookType, "id">
    const validatedValue = validateField(name, value)
    
    setBookFormData(current => ({
      ...current,
      [name]: validatedValue ?? value
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValid = validateForm(bookFormData)

    if (isValid && id) {
      return updateBookMutate({ ...bookFormData, id })
    }

    if (isValid) {
      return createBookMutate({ ...bookFormData })
    }
  }

  useEffect(() => {
    if (isCreateSuccess) {
      setBookFormData(formInitialState)
    }
  }, [isCreatePending, isCreateSuccess])

  useEffect(() => {
    if (book) setBookFormData(book)
    else setBookFormData(formInitialState)
  }, [book, id])

  if (id && isLoading) {
    return <p>Loading...</p>
  }

  return (
    <form
      className="space-y-4 m-auto w-lg"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <fieldset className="fieldset border-base-300 rounded-box border p-4" disabled={isCreatePending}>
        <legend className="fieldset-legend">Edit / Create</legend>

        <label htmlFor="title" className="label">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={`input ${errors?.title ? 'input-error' : ''}`}
          placeholder="Type the book's title..."
          value={bookFormData.title}
          onChange={handleChange}
        />
        {errors?.title && <span className="label text-error">{errors.title}</span>}

        <label htmlFor="author" className="label">Author</label>
        <input
          id="author"
          name="author"
          type="text"
          className={`input ${errors?.author ? 'input-error' : ''}`}
          placeholder="Who has written this?"
          value={bookFormData.author}
          onChange={handleChange}
        />
        {errors?.author && <span className="label text-error">{errors.author}</span>}
        
        <label htmlFor="description" className="label">Description</label>
        <input
          id="description"
          name="description"
          type="text"
          className={`input ${errors?.description ? 'input-error' : ''}`}
          placeholder="Tell us more about this book"
          value={bookFormData.description}
          onChange={handleChange}
        />
        {errors?.description && <span className="label text-error">{errors.description}</span>}

        <label htmlFor="status" className="label">Status</label>
        <select
          id="status"
          name="status"
          className={`select ${errors?.status ? 'select-error' : ''}`}
          value={bookFormData.status}
          onChange={handleChange}
        >
          <option disabled={true}>Set the status</option>
          <option value={'WISHLIST'}>Wishlist</option>
          <option value={'READING'}>Reading</option>
          <option value={'FINISHED'}>Finished</option>
        </select>
        {errors?.status && <span className="label text-error">{errors.status}</span>}

        <button type="submit" className="btn btn-neutral mt-4">
          {isCreatePending || isUpdatePending ? <Loader className="animate-spin" /> : "Save"}
        </button>
      </fieldset>
    </form>
  )
}
