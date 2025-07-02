import { z } from "zod"
import { CustomButton, CustomForm, CustomInput } from "../components"
import { useSignIn } from "../hooks/useSignIn"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { SignInBody } from "../services/signin"
import { Link } from "react-router"

const signInSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .trim(),
  password: z
    .string()
    .nonempty('Password is required')
})

export default function SignIn() {
  const { mutate, isPending } = useSignIn()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur'
  })

  const onSubmit = (data: SignInBody) => {
    mutate(data)
  }

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
            quasi. In deleniti eaque aut repudiandae et a id nisi.
          </p>
        </div>
        <CustomForm legend="Sign In" onSubmit={handleSubmit(onSubmit)} disabled={isPending}>
          <CustomInput
            label="Email"
            type="email"
            id="email"
            className="input w-full"
            placeholder="Email"
            {...register('email')}
            error={errors.email?.message}
          />
          
          <CustomInput
            label="Password"
            type="password"
            id="password"
            className="input w-full"
            placeholder="Password"
            {...register('password')}
            error={errors.password?.message}
          />
          <CustomButton isLoading={isPending} className="btn btn-neutral mt-4">Login</CustomButton>
          <Link to="/forgot-password">Forgot the password</Link>
        </CustomForm>
      </div>
    </div>
  )
}
