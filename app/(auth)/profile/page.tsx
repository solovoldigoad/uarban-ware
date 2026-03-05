"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Button } from '@/design/ui/button';
import { Input } from '@/design/ui/input';
import { Label } from '@/design/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/design/ui/card';
import { Separator } from '@/design/ui/separator';
import { useToast } from '@/hooks/useToast';
import { User, Mail, Phone, Pencil, Save, X, Loader2, ShieldCheck } from 'lucide-react';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/logIn');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    setIsLoadingProfile(true);
    fetch('/api/profile')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setFullName(data.user.name || '');
        setPhone(data.user.phone || '');
        setAddress(data.user.address || '');
      })
      .catch(() => {
        toast({ title: 'Failed to load profile', variant: 'destructive' });
      })
      .finally(() => {
        setIsLoadingProfile(false);
      });
  }, [status, toast]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast({ title: 'Name is required', variant: 'destructive' });
      return;
    }
    if (!phone.trim()) {
      toast({ title: 'Phone is required', variant: 'destructive' });
      return;
    }
    if (!address.trim()) {
      toast({ title: 'Address is required', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      toast({ title: 'Profile updated successfully' });
      setIsEditing(false);
    } catch (error: any) {
      toast({ title: 'Failed to update profile', description: error.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsLoadingProfile(true);
    fetch('/api/profile')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setFullName(data.user.name || '');
        setPhone(data.user.phone || '');
        setAddress(data.user.address || '');
      })
      .finally(() => {
        setIsLoadingProfile(false);
      });
  };

  if (status === 'loading' || !session) {
    return null;
  }

  const role = session.user.role || 'user';
  return (
    <div>
      <section className="pt-28 pb-16 px-6">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-headline mb-2">My Profile</h1>
            <p className="text-muted-foreground mb-8">Manage your account details</p>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-sans font-semibold">Personal Information</CardTitle>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Pencil size={14} className="mr-1.5" /> Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar placeholder */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                    <User size={28} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{fullName || 'User'}</p>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <ShieldCheck size={14} />
                      <span className="capitalize">{role}</span>
                    </div>
                  </div>
                </div>
                <Separator />
                {/* Email (read-only) */}
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5 text-muted-foreground">
                    <Mail size={14} /> Email
                  </Label>
                  <Input value={session.user.email || ''} disabled className="bg-muted" />
                </div>
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5 text-muted-foreground">
                    <User size={14} /> Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <Input value={fullName || '—'} disabled className="bg-muted" />
                  )}
                </div>
                {/* Phone */}
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone size={14} /> Phone
                  </Label>
                  {isEditing ? (
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <Input value={phone || '—'} disabled className="bg-muted" />
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5 text-muted-foreground">
                    Address
                  </Label>
                  {isEditing ? (
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your address"
                    />
                  ) : (
                    <Input value={address || '—'} disabled className="bg-muted" />
                  )}
                </div>
                {/* Action buttons */}
                {isEditing && (
                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? <Loader2 size={16} className="mr-1.5 animate-spin" /> : <Save size={16} className="mr-1.5" />}
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                      <X size={16} className="mr-1.5" /> Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Danger Zone */}
            <Card className="mt-6 border-destructive/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sign Out</p>
                    <p className="text-sm text-muted-foreground">Sign out of your account on this device</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      await signOut();
                      router.push('/');
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
