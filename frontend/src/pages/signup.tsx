import { CustomButton, CustomForm, CustomInput } from "../components";

export default function SignUp() {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Sign Up now!</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
            quasi. In deleniti eaque aut repudiandae et a id nisi.
          </p>
        </div>
        <CustomForm legend="Register">
          <CustomInput
            label="Email"
            type="email"
            className="input w-full"
            placeholder="Email"
          />
          
          <CustomInput
            label="Password"
            type="password"
            className="input w-full"
            placeholder="Password"
          />
          
          <CustomInput
            label="Confirm Password"
            type="confirmPassword"
            className="input w-full"
            placeholder="Confirm Password"
          />
          
          <CustomButton className="btn btn-neutral mt-4">Sign up</CustomButton>
        </CustomForm>
      </div>
    </div>
  )
}
