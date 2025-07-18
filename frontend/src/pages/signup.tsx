import { useForm } from "react-hook-form";
import { CustomButton, CustomForm, CustomInput } from "../components";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "../hooks/useSignUp";
import type { SignUpBody } from "../services/signup";

const signUpSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .max(100, "Email must be at most 100 characters")
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z
    .string()
    .min(8, "Confirm password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function SignUp() {
  const { mutate, isPending } = useSignUp()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur'
  })

  const onSubmit = (data: SignUpBody) => {
    mutate(data)
  }

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
        <CustomForm legend="Register" onSubmit={handleSubmit(onSubmit)} disabled={isPending}>
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
          
          <CustomInput
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            className="input w-full"
            placeholder="Confirm Password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
          
          <CustomButton isLoading={isPending} className="btn btn-neutral mt-4">Sign up</CustomButton>
        </CustomForm>
      </div>
    </div>
  )
}
