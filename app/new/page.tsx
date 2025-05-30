"use client"

import { useRouter } from "next/navigation";

import { BrandForm } from "@/components/forms/brand-form";
import { Button } from "@/components/ui/button";

export default function CreatePage() {
  const router = useRouter();

  return (
      <div className="bg-linear-160 to-accent from-accent/20 min-h-screen flex items-center justify-center">

      <main className="bg-background  rounded-xl shadow-xl w-1/2">
        <header className="flex justify-between items-center p-4 pb-0">
          <Button variant={"link"} onClick={() => router.push('/dashboard')}>Go back</Button>
          <Button onClick={() => router.push('/dashboard')}>Dashboard</Button>
        </header>
          <div className="max-w-3xl m-8">
            <h1 className="text-3xl font-bold mb-2">Create Your Brand</h1>
            <p className="text-muted-foreground mb-8">
              Tell us about your business, and our AI will generate a complete branding package for you.
            </p>
            <BrandForm />
          </div>
        </main>
      </div>
  );
}