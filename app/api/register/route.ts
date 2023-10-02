import { hash } from "@/utils/bcrypt";
import prismaDB from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
    name: z.string().nonempty('Name is required'),
    email: z.string().email("Invalid email").nonempty("Email is required"),
    password: z
      .string()
      .nonempty("Password is required")
      .refine(
        (value) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
            value
          ),
        "Must contain 8 Characters, one uppercase, lowercase, one number and one special case character"
      ),
  });

export const POST = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = await req.json();

    if (!schema.safeParse({email, name, password})) {
      return new NextResponse("missing info", { status: 400 });
    }

    const hashedPassword = await hash(password);

    const user = await prismaDB.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error, "REGISTRATION ERROR");
    return new NextResponse("email is already exist", { status: 400 });
  }
};