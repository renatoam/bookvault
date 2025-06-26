export default function Book() {
  return (
    <form className="space-y-4 m-auto w-lg">
      <fieldset className="fieldset border-base-300 rounded-box border p-4">
        <legend className="fieldset-legend">Edit / Create</legend>

        <label className="label">Title</label>
        <input type="text" className="input" placeholder="Type the book's title..." />

        <label className="label">Author</label>
        <input type="text" className="input" placeholder="Who has written this?" />

        <label className="label">Status</label>
        <select defaultValue="Set the status" className="select">
          <option disabled={true}>Set the status</option>
          <option>Wishlist</option>
          <option>Reading</option>
          <option>Finished</option>
        </select>
        <span className="label">Error</span>

        <button className="btn btn-neutral mt-4">Save</button>
      </fieldset>
    </form>
  )
}
