"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image";
import Link from "next/link"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Sparkles, Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useGlobalStore } from "@/store/useGlobalStore"

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
 
const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters."
    }),
})

const LoginForm = () => {
    const router = useRouter()

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { setUser } = useGlobalStore()

    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible)
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          password: "",
        },
    })

    const onSubmit = async ({ email, password }: z.infer<typeof formSchema>) => {
        setLoading(true)

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        if (!res.ok) {
            const {error} = await res.json();
            setError(error);
            setLoading(false)  
            return;
        };

        const { user } = await res.json();

        if (user) {
            setUser(user)
            router.push('/dashboard');
        }    
    }

    return (
        <div className="w-full max-w-148 bg-secondary p-8 xl:px-16 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2 pb-4">
                <Sparkles className="h-8 w-8 xl:h-12 xl:w-10 text-primary" />
                <h1 className="text-primary text-2xl font-bold">BrandGenie</h1>
            </div>
            <h1 className="font-bold text-2xl pb-4">Sign in to your account</h1>
            <Button className="hover:border-gray-400 transition-colors duration-300 w-full text-xl p-6 bg-secondary border-2 hover:bg-secondary hover:cursor-pointer text-primary/60">
                {/* TODO: Add google auth */}
                <Image
                    className="mr-2"
                    src="/google-icon.svg"
                    alt="Google logo"
                    width={32}
                    height={32}
                    priority
                />
                Google
            </Button>
            <div className="justify-between items-center flex flex-row py-2 text-xl text-primary/60 ">
                <div className="h-0.5 w-full bg-slate-300"></div>
                <p className="text-center m-4 min-w-40">or continue with</p>
                <div className="h-0.5 w-full bg-slate-300"></div>

            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <div className="flex flex-row items-center">
                                <Mail height={40} width={40} />
                                <Input autoComplete="off" className="ml-4 py-6 placeholder:text-lg" placeholder="Your Email" {...field} />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <div className="flex flex-row items-center">
                                <LockKeyhole height={40} width={40} />
                                <Input autoComplete="off" type={passwordVisible ? "" : "password"} className="mx-4 py-6 placeholder:text-lg" placeholder="Min 6 characters" {...field} />
                                {passwordVisible ? (
                                    <EyeOff className="hover:cursor-pointer" onClick={togglePasswordVisibility} height={40} width={40} />
                                ): (
                                    <Eye className="hover:cursor-pointer" onClick={togglePasswordVisibility} height={40} width={40} />
                                )}
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormMessage>{error}</FormMessage>
                    <Button disabled={loading} className="hover:cursor-pointer w-full text-xl p-6 mt-4" type="submit">Sign In</Button>
                    <p className="text-lg text-primary">
                    Don't have an account?
                        <Link className="pl-2 underline text-lg text-accent" href={"/register"}>Sign up here</Link>
                    </p>
                </form>
            </Form>
        </div>
    );
}
 
export default LoginForm;