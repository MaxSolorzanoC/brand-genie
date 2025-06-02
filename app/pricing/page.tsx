"use client"

import { useRouter } from "next/navigation";

import { useGlobalStore } from "@/store/useGlobalStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTransition } from "react";

const PricingPage = () => {
    const router = useRouter();
    const { user } = useGlobalStore();

    const [isPending, startTransition] = useTransition();

    const handleSubscribe = async () => {
        if (user) {
            startTransition(async () =>{
                //Subscribe user
                const res = await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        customerId: user.customerId,
                    }),
                });

                const {url} = await res.json();

                router.push(url);
            })
        }
    }

    return (
        <>
            <section className="py-20 px-4 bg-linear-160 to-accent from-accent/20 p-8 h-screen">
            <h2 className="text-3xl font-bold text-center mb-12 text-primary">Simple, Transparent Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                <Card className="bg-background hover:scale-105 transition-transform duration-300 ease-in-out">
                    <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-2">Free</h3>
                    <p className="text-3xl font-bold mb-4">$0</p>
                    <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>Unlimited text generation
                    </li>
                    </ul>
                    <Button variant={user?.isPro ? "default" : "secondary"} disabled={isPending} onClick={user?.isPro ? handleSubscribe : () => router.push('/dashboard')} className="w-full cursor-pointer">
                        {!user?.isPro? 'Go to Dashboard':'Cancel Subscription'}
                    </Button>
                    </CardContent>
                </Card>
                <Card  className="bg-background hover:scale-105 transition-transform duration-300 ease-in-out">
                    <div className="transform -translate-y-1/2 bg-primary text-secondary px-4 py-1 rounded-full text-sm font-medium w-1/2 mx-auto text-center">
                    Most Popular
                    </div>
                    <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-2">Pro</h3>
                    <p className="text-3xl font-bold mb-4">$10</p>
                    <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span> Access to logo editor
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-500">✓</span> Unlimited logo generation
                        </li>
                    </ul>
                    <Button variant={user?.isPro ? "secondary" : "default"} disabled={isPending} onClick={user?.isPro ? () => router.push('/dashboard') : handleSubscribe} className="w-full cursor-pointer">
                        {user?.isPro?'Go to Dashboard':'Upgrade'}
                    </Button>
                    </CardContent>
                </Card>
            </div>
        </section>
        </>
    );
}
 
export default PricingPage;