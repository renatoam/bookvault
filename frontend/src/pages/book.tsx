import { CustomButton, CustomForm, CustomInput, CustomSelect } from "../components"
import { useBookUpserting } from "../hooks/useBookUpserting"

export default function Book() {
  const {
    id,
    bookFormData,
    isLoading,
    errors,
    formRef,
    options,
    handleChange,
    handleSubmit
  } = useBookUpserting()

  return (
    <CustomForm
      onSubmit={handleSubmit}
      ref={formRef}
      disabled={isLoading}
      legend={id ? "Edit" : "Create"}
    >
      <CustomInput
        id="title"
        name="title"
        type="text"
        label="Title"
        className={`input ${errors?.title ? 'input-error' : ''}`}
        placeholder="Type the book's title..."
        value={bookFormData.title}
        onChange={handleChange}
        error={errors?.title}
      />

      <CustomInput
        id="author"
        name="author"
        label="Author"
        type="text"
        className={`input ${errors?.author ? 'input-error' : ''}`}
        placeholder="Who has written this?"
        value={bookFormData.author}
        onChange={handleChange}
        error={errors?.author}
      />

      <CustomInput
        id="description"
        name="description"
        label="Description"
        type="text"
        className={`input ${errors?.description ? 'input-error' : ''}`}
        placeholder="Tell us more about this book"
        value={bookFormData.description}
        onChange={handleChange}
        error={errors?.description}
      />
      
      <CustomSelect
        label="Status"
        id="status"
        name="status"
        className={`select ${errors?.status ? 'select-error' : ''}`}
        options={options}
        value={bookFormData.status}
        onChange={handleChange}
        error={errors?.status}
      />

      <CustomButton
        type="submit"
        className="btn btn-neutral mt-4"
        isLoading={isLoading}
      >Save</CustomButton>
    </CustomForm>
  )
}
