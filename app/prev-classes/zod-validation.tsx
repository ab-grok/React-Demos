"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { z } from "zod";
import { useState } from "react";

export default function Home() {
  const [submitted, setSubmitted] = useState(false);

  const formSchema = z.object({
    firstname: z
      .string()
      .trim()
      .regex(/^[a-z]+$/i, "Must be a valid name!")
      .min(3, "Too short!")
      .max(20, "Too long"),
    email: z.email("Invalid Email!"),
    password: z
      .string()
      .trim()
      .min(8, "Weak Password")
      .regex(/[A-Z]/, "Must include an UPPERCASE letter!")
      .regex(/[0-9]/, "Must include a number")
      .regex(/[!"£$%^&*()_+\-#@;:=]/, "Must include a symbol!"),
    phone: z
      .string()
      .regex(/^(?:\+|[0-9])[0-9-]{8,14}$/, "Not a valid phone number!")
      .optional(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      firstname: "",
      email: "",
      password: "",
      phone: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSubmitted(true);
  };

  return (
    <main className="relative flex h-full w-full items-center justify-center bg-black">
      <div className="box-shadow relative flex h-auto w-120 max-w-170 flex-col justify-center gap-2 rounded-4xl border-2 border-stone-700 bg-linear-150 from-white to-neutral-200 p-4 py-6 shadow-xl">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <section className="relative flex w-auto flex-col items-center gap-x-1 rounded-xl font-semibold antialiased duration-500 perspective-distant hover:bg-white hover:shadow-black">
            {submitted && (
              <div className="absolute top-0 rounded-xl bg-linear-180 from-green-200 to-green-500 p-4 shadow-sm ring-green-400 hover:ring-2">
                Form passed all validations!
              </div>
            )}
            <Field>
              <FieldLabel>Firstname</FieldLabel>
              <FieldContent>
                <Input {...form.register("firstname")} placeholder="john" />
              </FieldContent>
              <FieldError>
                {" "}
                {form.formState?.errors?.firstname?.message}
              </FieldError>
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <Input
                  {...form.register("email")}
                  placeholder="name@email.com"
                />
              </FieldContent>
              <FieldError> {form.formState?.errors?.email?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel>phone</FieldLabel>
              <FieldContent>
                <Input {...form.register("phone")} />
              </FieldContent>
              <FieldError> {form.formState?.errors?.phone?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel>Password</FieldLabel>
              <FieldContent>
                <Input {...form.register("password")} type="" />
              </FieldContent>
              <FieldError>
                {" "}
                {form.formState?.errors?.password?.message}
              </FieldError>
            </Field>
          </section>
          <section className="element grid h-30 w-auto items-center justify-center overflow-y-scroll rounded-2xl bg-black/30 p-4">
            <div className="flex min-w-80 justify-center">
              <Button
                type="submit"
                className="line-clamp-3 h-20 w-50 min-w-fit cursor-pointer rounded-xl bg-linear-to-r px-4 shadow-md transition-all hover:-translate-y-1 hover:bg-rose-600 hover:shadow-black active:from-rose-400 active:to-rose-800 active:shadow-none"
              >
                Submit
              </Button>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
}
