import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CustomButton, CustomForm, CustomInput } from "../components";
import { useResetPassword } from "../hooks/useResetPassword";
import type { ResetPasswordBody } from "../services/resetPassword";
import { useSearchParams } from "react-router";

const resetSchema = z.object({
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

export default function ResetPassword() {
  const { mutate, isPending } = useResetPassword()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
    mode: 'onBlur'
  })

  const onSubmit = (data: ResetPasswordBody) => {
    mutate({
      ...data,
      token
    })
  }

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <CustomForm legend="Reset Password" onSubmit={handleSubmit(onSubmit)} disabled={isPending}>          
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
          
          <CustomButton isLoading={isPending} className="btn btn-neutral mt-4">Reset</CustomButton>
        </CustomForm>
      </div>
    </div>
  )
}
