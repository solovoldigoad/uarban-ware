import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongoDB";
import Product from "@/modles/Product";
import cloudinary from "@/lib/cloudinary";


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const formData = await req.formData();

    const name = String(formData.get("name") || "").trim();
    const price = Number(formData.get("price") || 0);
    const category = String(formData.get("category") || "").trim();
    const mensCategory = String(formData.get("mensCategory") || "").trim();
    const womensCategory = String(formData.get("womensCategory") || "").trim();
    const color = String(formData.get("color") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const status = String(formData.get("status") || "active");
    const discount = Number(formData.get("discount") || 0);
    const rawSizes = String(formData.get("sizes") || "[]");
    let sizes: string[] = [];
    try {
      const parsed = JSON.parse(rawSizes);
      if (Array.isArray(parsed)) {
        sizes = parsed.map((s) => String(s));
      }
    } catch {
      sizes = [];
    }
    const imageFile = formData.get("image") as File | null;

    if (!name || !price || !category) {
      return new Response(JSON.stringify({ message: "Name, price and category are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!imageFile || imageFile.size === 0) {
      return new Response(JSON.stringify({ message: "Product image is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return new Response(JSON.stringify({ message: "Cloudinary is not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "products",
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(buffer);
    });

    await connectDB();

    const product = await Product.create({
      name,
      price,
      category,
      mensCategory: category === "men" ? mensCategory : "",
      womensCategory: category === "women" ? womensCategory : "",
      color,
      description,
      status,
      discount,
      sizes,
      image: uploadResult.secure_url,
      isNew: true,
      isTrending: false,
    });

    return new Response(JSON.stringify({ product }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return new Response(JSON.stringify({ message: error.message || "Failed to create product" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
