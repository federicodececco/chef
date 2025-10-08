import { NextRequest, NextResponse } from "next/server";
import { createPhoto, getAllPhotos } from "@/actions/photo";
import { join } from "path";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { writeFile } from "fs/promises";
import { updateChef } from "@/actions/chef";

/* export async function POST(request: NextRequest) {
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
    let path = `/uploads/images/${filename}`;

    if (type === "avatar") {
      path = `/uploads/avatarImages/${filename}`;
      await updateChef(chefId, { avatarUrl: path });
    }
    if (type === "cover") {
      path = `/uploads/coverImages/${filename}`;
      await updateChef(chefId, { coverUrl: path });
    }
    const result = await createPhoto({
      filename: file.name,
      path: path,
      size: resizedBuffer.length,
      width: finalMetadata.width,
      height: finalMetadata.height,
      mimeType: "image/jpeg",
      imageUrl: path,
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
} */

export async function GET() {
  try {
    const result = await getAllPhotos();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 },
    );
  }
}

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
      return NextResponse.json({ error: "missing chefId" }, { status: 400 });
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
      default: "images",
    };

    const folder = folderMap[type] || folderMap.default;
    const blobPath = `${folder}/${filename}`;

    const blob = await put(blobPath, resizedBuffer, {
      access: "public",
      contentType: "image/jpeg",
    });

    if (type === "avatar") {
      await updateChef(chefId, { avatarUrl: blob.url });
    } else if (type === "cover") {
      await updateChef(chefId, { coverUrl: blob.url });
    }

    const result = await createPhoto({
      filename: file.name,
      path: blobPath,
      size: resizedBuffer.length,
      width: finalMetadata.width,
      height: finalMetadata.height,
      mimeType: "image/jpeg",
      imageUrl: blob.url,
      chefId: chefId,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      photo: result.data,
      url: blob.url,
    });
  } catch (error) {
    console.error("Errore upload:", error);
    return NextResponse.json(
      { error: "Errore durante l'upload" },
      { status: 500 },
    );
  }
}
