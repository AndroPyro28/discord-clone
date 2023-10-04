"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { BsGithub, BsGoogle } from "react-icons/bs";
import Input from "@/components/inputs/Input";
import AuthSocialButton from "./AuthSocialButton";
import toast from "react-hot-toast";
import { mutate } from "@/hooks/useQueryProcessor";
import LoadingSpinner from "@/components/loaders/LoadingSpinner";

function AuthForm() {
  
  type variant = "LOGIN" | "REGISTER";
  const [variants, setVariants] = useState<variant>("LOGIN");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const session = useSession();

  const schema = z.object({
    name: variants === 'REGISTER' ? z.string().nonempty('Name is required') : z.string(),
    email: z.string().email("Invalid email").nonempty("Email is required"),
    password: variants === 'REGISTER' ? z
      .string()
      .nonempty("Password is required")
      .refine(
        (value) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
            value
          ),
        "Must contain 8 Characters, one uppercase, lowercase, one number and one special case character"
      ) : z
      .string()
      .nonempty("Password is required")
  });
  
  type FormValues = z.infer<typeof schema> | FieldValues;

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/");
    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    if (variants === "LOGIN") {
      setVariants((prev) => "REGISTER");
    } else {
      setVariants((prev) => "LOGIN");
    }
  }, [variants]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const registerMutation = mutate<FormValues, unknown>('/register', 'POST', ['register'])


  const disabled = loading || isSubmitting;

  
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    try {
      if (variants == "REGISTER") {
        
            registerMutation.mutate(data, {
              onSuccess: async () => {
                toast.success("Register Success!");
                void signIn("credentials",data);
              }
            })
      }
      if (variants == "LOGIN") {
          const response = await signIn("credentials", {
            ...data,
            redirect: false,
          });
          if (response?.error) {
            toast.error("invalid credentials");
          }
          if (response?.ok && !response.error) {
            toast.success("Logged In!");
          }
      }
    } catch (error: any) {
      // toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const socialActions = async (action: string) => {
    setLoading(true);

    try {
      const response = await signIn(action, { redirect: false });

      if (response?.error) {
        toast.error("invalid credentials");
      }

      if (response?.ok && !response.error) {
        toast.success("Logged In!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:w-[90%] md:w-[60%] rounded-md  text-white items-center gap-5">
      <h1 className="text-4xl font-bold">Welcome back!</h1>
      <p className="text-gray-400 text-xl">We're so excited to see you again!</p>

      <form
        action=""
        onSubmit={handleSubmit(onSubmit)}
        className="w-full gap-10"
      >
        {variants === "REGISTER" && (
          <Input
          className="bg-[rgb(30,31,34)] text-white w-full p-3 outline-none rounded-md"
            errors={errors}
            label="Name"
            register={register}
            id="name"
            disabled={disabled}
            placeholder="Name"
          />
        )}

        <Input
          className="bg-[rgb(30,31,34)] text-white w-full p-3 outline-none rounded-md"
          errors={errors}
          label="Email"
          type="email"
          register={register}
          id="email"
          placeholder="Email"
          disabled={disabled}
        />

        <Input
          className="bg-[rgb(30,31,34)] text-white w-full p-3 outline-none rounded-md"
          errors={errors}
          label="Password"
          type="password"
          register={register}
          id="password"
          placeholder="Password"
          disabled={disabled}
        />

        <button
          disabled={disabled}
          type="submit"
          className="w-full text-black  font-bold mt-5 p-2 rounded-md bg-[rgb(222,183,104)] flex justify-center"
        >
          {(() => {
            if (!loading) return variants === "LOGIN" ? "Sign in" : "Register";

              return <LoadingSpinner size={30} />;

          })()}
        </button>

        
      </form>

      <div className="mt-6 w-full">
          <div className="relative">
            <div className="absolue inset-0 flex items-center ">
              <div className="w-full border-white border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-black px-2 text-white -mt-3">
                Or continue with
              </span>
            </div>
          </div>

        <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialActions("github")}
              socialName="github"
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialActions("google")}
              socialName="google"

            />
          </div>

        <div
          className="flex gap-2 text-md mt-6 px-2 text-gray-500"
          
        >
          {variants === "LOGIN"
            ? "New to discord?"
            : "Already have an account?"}
          <div className=" cursor-pointer text-[rgb(4,165,228)]" onClick={toggleVariant}>
            {variants === "LOGIN" ? "Create an account" : "Login"}
          </div>
        </div>
    </div>
    </div>
  );
}

export default AuthForm;
