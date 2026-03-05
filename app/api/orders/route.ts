import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongoDB";
import User from "@/modles/User";
import Order from "@/modles/Order";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, total } = body as { items?: any[]; total?: any };

    if (!Array.isArray(items) || items.length === 0 || typeof total !== "number") {
      return NextResponse.json({ message: "Invalid order data" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const normalizedItems = items.map((i) => {
      let image = "";
      if (typeof i.image === "string") {
        image = i.image;
      } else if (i.image && typeof i.image.src === "string") {
        image = i.image.src;
      } else {
        image = "/product-1.jpg";
      }

      return {
        id: String(i.id ?? ""),
        name: String(i.name ?? ""),
        price: Number(i.price ?? 0),
        quantity: Number(i.quantity ?? 1),
        size: i.size ?? i.selectedSize ?? null,
        color: i.color ?? i.selectedColor ?? null,
        image,
      };
    });

    const order = await Order.create({
      user: user._id,
      items: normalizedItems,
      total: Number(total),
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: any) {
    console.error("Orders POST error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status } = body as { id?: string; status?: string };

    if (!id || !status) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const order = await Order.findOneAndUpdate(
      { _id: id, user: user._id },
      { status },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
