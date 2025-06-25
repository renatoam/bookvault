export default function Forgot() {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend className="fieldset-legend">Forgot Password</legend>

            <label className="label">Email</label>
            <input type="email" className="input" placeholder="Email" />

            <button className="btn btn-neutral mt-4">Reset</button>
          </fieldset>
        </div>
      </div>
    </div>
  )
}
