"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { parseApiResponse } from "@/lib/http";
import {
  contactSchema,
  type ContactInput,
} from "@/lib/validations/forms";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      website: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await parseApiResponse<{ message?: string }>(res);
      if (!result.ok) throw new Error(result.message);
      setStatus("success");
      setMessage(result.data?.message || result.message || "Mesajınız alındı.");
      reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Bir hata oluştu");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Ad Soyad" error={errors.name?.message}>
          <input className={inputClass} {...register("name")} />
        </Field>
        <Field label="E-posta" error={errors.email?.message}>
          <input type="email" className={inputClass} {...register("email")} />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Telefon" error={errors.phone?.message}>
          <input className={inputClass} {...register("phone")} />
        </Field>
        <Field label="Konu" error={errors.subject?.message}>
          <input className={inputClass} {...register("subject")} />
        </Field>
      </div>
      <Field label="Mesaj" error={errors.message?.message}>
        <textarea rows={5} className={inputClass} {...register("message")} />
      </Field>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
        {...register("website")}
      />
      <Button type="submit" disabled={status === "loading"} size="lg">
        {status === "loading" ? "Gönderiliyor..." : "Mesaj Gönder"}
      </Button>
      {message ? (
        <p
          role="status"
          className={
            status === "success" ? "text-sm text-success" : "text-sm text-danger"
          }
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-bold text-primary">{label}</span>
      {children}
      {error ? <span className="block text-xs text-danger">{error}</span> : null}
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-primary/10 bg-white px-4 py-3 text-sm text-primary shadow-sm placeholder:text-primary/35";
