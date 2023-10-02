"use client";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactElement,
} from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

type InputProps = {
  label: string;
  required?: boolean;
  disabled?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

function Input({
  label,
  required,
  disabled,
  register,
  errors,
  ...rest
}: InputProps): ReactElement {
  const id = {...rest}?.id as string;
  return (
    <div className="gap-1 flex flex-col mt-2">
      <label
        htmlFor={id}
        className="capitalize text-white text-md px-1"
      >
        {label}
      </label>
      <div className=" gap-1 flex flex-col mt-2">
        <input
          id={id}
          disabled={disabled}
          {...rest}
          {...register(id as string, { required })}
        />
        <span className="text-red-500">{errors[id]?.message as string}</span>
      </div>
    </div>
  );
}

export default Input;
