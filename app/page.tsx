"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useGlobalStore } from "@/store/useGlobalStore";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const router = useRouter();

  const { user } = useGlobalStore();

  return (
    <div className="min-h-screen bg-linear-to-b from-secondary via-accent/30 to-secondary">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-primary text-2xl font-bold">BrandGenie</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-primary hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-primary hover:text-primary transition-colors">
            How It Works
          </Link>
        </nav>
        <div className="flex items-center gap-2 ">
          {
            user ? (
              <Button onClick={() => {
                router.push("/dashboard");
              }}>
                Dashboard
              </Button>
            ): (
              <>
                <Button className="hover:cursor-pointer" onClick={() => {
                  router.push("/login");
                }} variant="outline" size="sm">
                  Log In
                </Button>
                <Button className="hover:cursor-pointer" onClick={() => {
                  router.push("/register");
                }} size="sm">Sign Up</Button>
              </>
            )
          }
        </div>
      </header>
      <main>
        <section className="container mx-auto py-20 px-4 text-center">
          <h1 className="text-primary text-4xl md:text-6xl font-bold mb-6">
            Your Brand Identity, <span className="text-accent">AI-Powered</span>
          </h1>
          <p className="text-xl text-primary max-w-2xl mx-auto mb-10">
            Generate complete branding elements in seconds. From basic information to logos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/create">
                Create Your Brand <Sparkles className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
        <section id="features" className="container mx-auto py-20 px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">What BrandGenie Creates For You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">Basic information</h3>
                <p className="text-primary">
                  Generate a name and description for your brand.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">Logo Concepts</h3>
                <p className="text-primary">
                  Get AI-generated logo concepts that capture your brand's essence.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">Catchy Slogans</h3>
                <p className="text-primary">
                  Memorable phrases that communicate your brand's value proposition.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="how-it-works" className="bg-secondary py-20 shadow-sm opacity-90 shadow-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-primary">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary text-primary-primary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Describe Your Brand</h3>
                <p className="text-primary">Tell us about your audience and what your product or service does.</p>
              </div>
              <div className="text-center">
                <div className="bg-primary text-primary-primary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2 text-primary">AI Generation</h3>
                <p className="text-primary">Our AI creates branding elements based on your description.</p>
              </div>
              <div className="text-center">
                <div className="bg-primary text-primary-primary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Refine & Customize</h3>
                <p className="text-primary">Accept or regenerate elements until you're satisfied.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="text-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Brand?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of businesses using BrandGenie to create compelling brand identities.
            </p>
            <Button size="lg" asChild>
              <Link href="/create">
                Get Started Now <Sparkles className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      {/* TODO: Add footer */}
    </div>
  );
}