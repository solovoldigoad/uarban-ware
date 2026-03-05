import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongoDB";
import Order from "@/modles/Order";
import User from "@/modles/User";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const orders = await Order.find({})
      .populate("user")
      .sort({ createdAt: -1 })
      .lean();

    const mapped = orders.map((order: any) => {
      const user = order.user as any;
      return {
        id: String(order._id),
        customer: user?.name || "Customer",
        email: user?.email || "",
        items: (order.items || []).map((item: any) => ({
          name: item.name,
          qty: item.quantity,
          price: item.price,
        })),
        total: order.total,
        status: order.status,
        paymentStatus: "paid",
        date: new Date(order.createdAt).toISOString().slice(0, 10),
        address: user?.address || "",
      };
    });

    return NextResponse.json({ orders: mapped });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

