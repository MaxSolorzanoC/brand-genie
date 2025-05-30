"use client"

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Stripe from "stripe";

import { Check, X } from "lucide-react";

import UnauthorizedDialog from "@/components/unauthorized-dialog";
import { useGlobalStore } from "@/store/useGlobalStore";
import { Button } from "@/components/ui/button";

const SubscriptionPage = () => {
    const searchParams = useSearchParams();
    const params = searchParams.get('q');
    //If user was redirected to search param q (e.g. "/subscription?q=unauthorized") means user tried to enter a protected route and was not subscribed
    
    const router = useRouter();

    const {user} = useGlobalStore();
    
    const [open, setOpen] = useState(false);
    const [subscriptionData, setSubscriptionData] = useState<Stripe.Subscription | null>(null);
    
    useEffect(() => {
        if(params) {
            //If params is not null (meaning that the user tried to enter protected route) open dialog
            setOpen(true);
        }
    }, [params])

    const toggleRenewal = async () => {
        //When toggle renewal button is pressed, change stripe monthly billing to false
        try {
            const res = await fetch('/api/toggle-renewal', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    subscriptionId: subscriptionData?.id,
                    cancelAtPeriodEnd: subscriptionData?.cancel_at_period_end
            }),
        });

        //Upgrade state variable so user know concurrent billing has been changed
        const {subscription} = await res.json();
        setSubscriptionData(subscription)
        } catch (err) {
            console.error(err)
        }
    };



    useEffect(() => {
        //Fetch user stripe subscription info
        async function fetchInfo() {
            const res = await fetch('/api/subscription-info');
            const data:Stripe.Subscription = await res.json();
            console.log(data)
            setSubscriptionData(data)
        }
        if (user?.customerId) {
            fetchInfo();
        }
    }, [user]);

    return (
        <>
            <UnauthorizedDialog open={open} setOpen={setOpen} title="Unauthorized" description="You need to subscribe to access this feature." buttons={[
                {
                    onClick: () => setOpen(false),
                    text: "Subscribe", 
                },
                {
                    onClick: () => router.back(),
                    text: "Return to dashboard", 
                    variant: "secondary"
                }
            ]} />
            <div className="h-screen w-full flex bg-linear-160 to-accent from-accent/20 ">
                <div className="pb-8 bg-background rounded-xl shadow-xl w-4/5 md:w-1/2 m-auto flex flex-col">
                    <Button className="m-8 mb-0 w-28" onClick={() => {
                        router.push("/dashboard");
                    }}>
                        Dashboard
                    </Button>
                    <div className="flex flex-col items-center flex-1">
                        <h1 className="text-primary text-3xl md:text-4xl xl:text-5xl font-bold py-8">Your Subscription</h1>
                        <div className="w-full flex-1 px-8 lg:px-12 xl:px-40 flex items-center justify-center">
                            <div className="w-full grid grid-cols-1 gap-8">
                                <div className="border-2 p-4 rounded-xl shadow-md grid grid-cols-2">
                                    <p className="flex items-center">Current Subscription:</p> 
                                    <p className="flex justify-end items-center px-4 bg-secondary h-16 rounded-lg">{subscriptionData?.status == "active" ? "Pro" : "Free"}</p>
                                </div>
                                {user?.isPro ? (
                                        <>
                                            <div className="border-2 p-4 rounded-xl shadow-md grid grid-cols-2 gap-4">
                                                <p className="flex items-center">Subscription Starting Date:</p>
                                                <p className="flex justify-end items-center px-4 text-right bg-secondary h-16 rounded-lg">{subscriptionData?.start_date ? new Date(subscriptionData?.start_date * 1000).toLocaleString() : "N/A"}</p>
                                            </div>
                                            <div className="border-2 p-4 rounded-xl shadow-md grid grid-cols-2 gap-4">
                                                <p className="flex items-center">Subscription Cancels At:</p>
                                                <p className="flex justify-end items-center px-4 text-right bg-secondary h-16 rounded-lg">{subscriptionData?.cancel_at ? new Date(subscriptionData?.cancel_at * 1000).toLocaleString() : "N/A"}</p>
                                            </div>
                                            <div className="border-2 p-4 rounded-xl shadow-md grid grid-cols-2 gap-4">
                                                <p className="flex items-center">Recurring billing:</p>
                                                <div className="flex justify-end items-center mr-4 text-right">
                                                    <div onClick={toggleRenewal} className={`cursor-pointer px-1 flex items-center rounded-full w-20 h-10 ${subscriptionData?.cancel_at_period_end ? "bg-linear-120 from-primary/50 to-primary/80 text-secondary" : "bg-linear-120 from-accent to-accent/50 text-secondary justify-end"}`}>
                                                        <div className="h-8 w-8 bg-secondary rounded-full transition-all text-primary flex items-center justify-center">
                                                            {subscriptionData?.cancel_at_period_end ? <X /> : <Check />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <Button onClick={() => router.push('/pricing')}>Upgrade to pro</Button>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
 
export default SubscriptionPage;