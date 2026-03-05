import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongoDB';
import User from '@/modles/User';

export async function POST(req: Request) {
  try {
    const { name, email, password, role, adminCode, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (role === 'admin') {
      if (!adminCode || adminCode !== process.env.ADMIN_ACCESS_CODE) {
        return NextResponse.json({ message: 'Invalid admin access code' }, { status: 403 });
      }
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      phone: phone || null,
      address: null,
    });

    return NextResponse.json({ message: 'User created successfully', user: { name: user.name, email: user.email } }, { status: 201 });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
