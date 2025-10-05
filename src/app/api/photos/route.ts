import { NextRequest, NextResponse } from "next/server";
import {
  createPhoto,
  createMultiplePhotos,
  getAllPhotos,
} from "@/actions/photo";
import { join } from "path";
import sharp from "sharp";
import { writeFile } from "fs/promises";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("photo") as File;
    const chefId = formData.get("chefId") as string;

    const type = formData.get("type") as string;

    if (!file) {
      return NextResponse.json({ error: "No file present" }, { status: 400 });
    }

    if (!chefId) {
      return NextResponse.json({ error: "missing chiefId" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Il file deve essere un'immagine" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const resizedBuffer = await sharp(buffer)
      .resize(1920, 1920, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .rotate()
      .jpeg({ quality: 90 })
      .toBuffer();

    const finalMetadata = await sharp(resizedBuffer).metadata();

    const timestamp = Date.now();
    const sanitizedName = file.name
      .replace(/\s/g, "-")
      .replace(/[^a-zA-Z0-9.-]/g, "");
    const filename = `${timestamp}-${sanitizedName.replace(/\..+$/, ".jpg")}`;

    const folderMap: Record<string, string> = {
      cover: "coverImages",
      avatar: "avatarImages",
    };

    const folder = folderMap[type] || "images";
    const uploadDir = join(process.cwd(), "public", "uploads", folder);
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, resizedBuffer);

    const result = await createPhoto({
      filename: file.name,
      path: `/uploads/${filename}`,
      size: resizedBuffer.length,
      width: finalMetadata.width,
      height: finalMetadata.height,
      mimeType: "image/jpeg",
      imageUrl: `/uploads/${filename}`,
      chefId: chefId,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      photo: result.data,
    });
  } catch (error) {
    console.error("Errore upload:", error);
    return NextResponse.json(
      { error: "Errore durante l'upload" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const result = await getAllPhotos();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 },
    );
  }
}
