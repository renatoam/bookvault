import { useParams } from "react-router"
import { useGetBook } from "./useGetBook"
import { useCreateBook } from "./useCreateBook"
import { useUpdateBook } from "./useUpdateBook"
import { useBookValidation } from "./useBookValidation"
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import type { Book as BookType } from "../types/book"

const formInitialState: BookType = {
  title: '',
  author: '',
  description: '',
  status: 'WISHLIST'
}

const options = [
  {
    value: 'WISHLIST',
    label: 'Wishlist',
  },
  {
    value: 'READING',
    label: 'Reading',
  },
  {
    value: 'FINISHED',
    label: 'Finished',
  },
]

export const useBookUpserting = () => {
  const { id } = useParams()
  const { data: book, isLoading: isGetLoading } = useGetBook(id)

  const {
    mutate: createBookMutate,
    isPending: isCreatePending,
    isSuccess: isCreateSuccess
  } = useCreateBook()

  const {
    mutate: updateBookMutate,
    isPending: isUpdatePending,
  } = useUpdateBook()
  
  const isLoading = isGetLoading || isUpdatePending || isCreatePending
  const { validateField, validateForm, errors } = useBookValidation()
  const [bookFormData, setBookFormData] = useState<BookType>(book ?? formInitialState)
  const formRef = useRef<HTMLFormElement>(null)

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target.value
    const name = event.target.name as keyof Omit<BookType, "id">
    const validatedValue = validateField(name, value)
    
    setBookFormData(current => ({
      ...current,
      [name]: validatedValue ?? value
    }))
  }, [validateField])

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValid = validateForm(bookFormData)

    if (isValid && id) {
      return updateBookMutate({ ...bookFormData, id })
    }

    if (isValid) {
      return createBookMutate({ ...bookFormData })
    }
  }, [bookFormData, createBookMutate, id, updateBookMutate, validateForm])

  useEffect(() => {
    if (isCreateSuccess) {
      setBookFormData(formInitialState)
    }
  }, [isCreatePending, isCreateSuccess])

  useEffect(() => {
    if (book) setBookFormData(book)
    else setBookFormData(formInitialState)
  }, [book, id])

  return {
    id,
    bookFormData,
    isLoading,
    errors,
    formRef,
    options,
    handleChange,
    handleSubmit
  }
}
