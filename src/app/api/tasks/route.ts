import { toast } from "sonner";
import prisma from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const POST = async (request: NextRequest) => {
  try {
    const data = await request.json();
    const response = await prisma.category.create({
      data: data,
    });
    revalidatePath('/tasks')
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      console.log(error);

      return NextResponse.json(
        { message: "Category already exists" },
        { status: 409 }
      );
    } else {
      console.log(error);
      return NextResponse.json(error.message, { status: 409 });
    }
  }
};
