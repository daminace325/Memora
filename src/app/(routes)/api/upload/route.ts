import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/config"
import { auth } from "@/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Only JPEG, PNG, GIF, and WebP images are allowed" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size must be under 5MB" }, { status: 400 });
    }

    const uploadData = await pinata.upload.file(file, {
      groupId: '0193cef6-bde0-7048-8e4b-e09987c21791',
    })
    const fileUrl = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/files/${uploadData.cid}`
    return NextResponse.json(fileUrl, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
