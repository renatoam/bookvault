import type { FormEvent } from "react"
import { useCreateBook } from "../hooks/useCreateBook"
import type { Book } from "../services/createBook"
import { useBookValidation } from "../hooks/useBookValidation"
import { Loader } from "lucide-react"

export default function Book() {
  const { mutate, isPending } = useCreateBook()
  const { validate, errors } = useBookValidation()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const keys = Array.from(data.keys())
    const fields = keys.reduce((acc, key) => {
      const value = (data.get(key) ?? '') as string
      return {
        ...acc,
        [key]: value
      }
    }, {} as Book)

    const isValid = validate(fields)

    if (isValid) {
      mutate({ ...fields })
    }
  }

  return (
    <form
      className="space-y-4 m-auto w-lg"
      onSubmit={handleSubmit}
    >
      <fieldset className="fieldset border-base-300 rounded-box border p-4" disabled={isPending}>
        <legend className="fieldset-legend">Edit / Create</legend>

        <label htmlFor="title" className="label">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={`input ${errors?.title ? 'input-error' : ''}`}
          placeholder="Type the book's title..."
        />
        {errors?.title && <span className="label text-error">{errors.title}</span>}

        <label htmlFor="author" className="label">Author</label>
        <input id="author" name="author" type="text" className="input" placeholder="Who has written this?" />
        
        <label htmlFor="description" className="label">Description</label>
        <input id="description" name="description" type="text" className="input" placeholder="Tell us more about this book" />

        <label htmlFor="status" className="label">Status</label>
        <select id="status" name="status" defaultValue="Set the status" className="select">
          <option disabled={true}>Set the status</option>
          <option value={'WISHLIST'}>Wishlist</option>
          <option value={'READING'}>Reading</option>
          <option value={'FINISHED'}>Finished</option>
        </select>

        <button type="submit" className="btn btn-neutral mt-4">
          {isPending ? <Loader className="animate-spin" /> : "Save"}
        </button>
      </fieldset>
    </form>
  )
}
