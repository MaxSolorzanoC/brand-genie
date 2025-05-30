"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Sparkles } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useGlobalStore } from "@/store/useGlobalStore";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const formSchema = z.object({
  audience: z.string().min(10, {
    message: "Please describe your target audience in at least 10 characters.",
  }),
  description: z.string().min(20, {
    message: "Please provide a more detailed description (at least 20 characters).",
  }),
  industry: z.string().min(2, {
    message: "Industry must be at least 2 characters.",
  }),
  temperature: z.number().array(),
});

export function BrandForm() {
  const router = useRouter();
  
  const { user, setPrompt } = useGlobalStore();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      audience: "",
      description: "",
      industry: "",
      temperature: [0.5]
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setPrompt(values)
    setLoading(true)

    //Generate branding info using openai api
    const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          industry: values.industry,
          audience: values.audience,
          description: values.description,
          temperature: values.temperature    
        }),
    })
    
    if (!res.ok) {
      const {error} = await res.json();
      setError(error);
      setLoading(false)  
      return;
    };

    const info = await res.json();

    //Upload the returned values to the db
    const { data, error } = await supabase.from("projects").insert({
      ...info,
      userId: user?.id
    }).select('id').single()

    if (error) {
      console.error(error.message);
      setLoading(false)
      return;
    }
    
    //Redirect to the project dashboard page
    setLoading(false);
    router.push(`/dashboard/${data?.id}/info`)          
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">        
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
              <FormControl>
                <Input placeholder="Technology, Healthcare, Education" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="audience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Audience</FormLabel>
              <FormControl>
                <Input
                  placeholder="Small business owners aged 30-50 who need help with digital marketing"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product/Service Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="We provide cloud-based software that helps small businesses automate their customer support with AI chatbots"
                  className="resize-none !text-base h-22"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="temperature"
          render={({ field }) => (
              <FormItem>
              <FormLabel>Temperature</FormLabel>
              <div className="w-full  flex">
              <FormControl>
                  <Slider value={form.getValues('temperature')} className="mr-4" min={0} max={1} step={0.1} onValueChange={(value) => {
                      form.setValue('temperature', value)}} />
              </FormControl>
                  <div className="flex items-center justify-center rounded-sm bg-secondary h-10 w-10 ">
                      {form.getValues('temperature')}
                  </div>
              </div>
              <FormDescription className="w-full">Controls the randomness of the output. 1 diverse and creative, 0 focused and deterministic.</FormDescription>
              <FormMessage />
              </FormItem>
          )}
        />
        <FormMessage>{error}</FormMessage>
        <Button disabled={loading} type="submit" className="w-full">
              Generate Brand Identity
              <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
}