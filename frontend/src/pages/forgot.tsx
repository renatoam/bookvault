import { z } from "zod";
import { CustomButton, CustomForm, CustomInput } from "../components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForgotPassword } from "../hooks/useForgotPassword";
import type { ForgotPasswordBody } from "../services/forgotPassword";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

const forgotSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .trim(),
})

export default function Forgot() {
  const { mutate, isPending } = useForgotPassword()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotSchema),
    mode: 'onBlur'
  })

  const onSubmit = (data: ForgotPasswordBody) => {
    mutate(data)
  }

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <CustomForm legend="Forgot password" onSubmit={handleSubmit(onSubmit)} disabled={isPending}>
          <CustomInput
            label="Email"
            type="email"
            id="email"
            className="input w-full"
            placeholder="Email"
            {...register('email')}
            error={errors.email?.message}
          />
          <CustomButton isLoading={isPending} className="btn btn-neutral mt-4">Reset</CustomButton>
          <Link to="/signin" className="flex items-center gap-2">
            <ArrowLeft />
            <p>Back to login</p>
          </Link>
        </CustomForm>
      </div>
    </div>
  )
}
