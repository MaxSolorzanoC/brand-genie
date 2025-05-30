import { useState } from "react";

import z from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkle } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { Project } from "@/type";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
    name: z.string(),
    description: z.string(),
    slogan: z.string(),
  })

type Props = {
    project: Project;
    setProject: (project: Project) => void;
}

const InfoForm = ({ project, setProject }: Props) => {

    const [isOpen, setIsOpen] = useState(false);
    //The selected field is to indicate wich value we are regenerating
    const [selectedField, setSelectedField] = useState<null | "name" | "description" | "slogan">(null); 
    //Prompt for specific instructions on how we want the value to be regenerated
    const [prompt, setPrompt] = useState('');
    const [dialogDisabled, setDialogDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    //Temperature use to indicate the randomness of the new regenerated value
    const [temperature, setTemperature] = useState([0.5]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: project.name,
            description: project.description,
            slogan: project.slogan,
        },
    });
    //Indicates if the form values have been modified
    //If modified, allow user to save new changes pr reset to previous values
    const isFormEdited = form.formState.isDirty;

    //Update previous project values from the db to new values
    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        setLoading(true)
        const { data, error } = await supabase.from("projects").update(values).eq('id', project.id).select('*').single();
        if(error) {
            console.error(error.message)
            setLoading(false)
            return
        }
        if (data) {
            //Sets isFormEdited to false
            form.reset({
                name: data.name,
                description: data.description,
                slogan: data.slogan,
            });
            setProject(data); 
            console.log(data)
        }
        
        toast.success("Changes saved successfully!");
        setLoading(false)
    }

    //Uses the input prompt and the temperature value to regenerate a new value for the selectedField using openai api
    const regenerateValue = async () => {
        setDialogDisabled(true);

        if (selectedField){
            const res = await fetch("/api/regenerate", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  prompt,
                  selectedField,
                  previousData: form.getValues(selectedField),
                  temperature: temperature[0],
                }),
              });   
            if (!res.ok) {
                const {error} = await res.json();
                console.error(error)
                return;
            }
                   
            const {data} = await res.json();

            //Sets isFormEdited to true, allowing user to save changes or reset values
            form.setValue(selectedField, data, {
                shouldDirty: true,
            });
        }

        setDialogDisabled(false);
        setIsOpen(false);
    }

    return (
        <div className="bg-white p-8 xl:px-12 rounded-2xl shadow-xl mx-12 my-8">
            <h1 className="font-medium text-neutral-600 text-3xl mb-10">Basic Information</h1>
            {/* This dialog will be used as a form to regenerate new value */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>{`Regenerate ${selectedField}`}</DialogTitle>
                    <DialogDescription>
                        Give especific instructions on how you want your bussiness {selectedField} to look.
                    </DialogDescription>
                    </DialogHeader>
                    <Textarea disabled={dialogDisabled} onChange={(e) => {
                        setPrompt(e.target.value)
                    }} className="resize-none !text-base" placeholder={`How do you want your business ${selectedField} to look? Give specific instructions... `} />
                    <div className="mt-4">
                        <Label>Temperature</Label>
                        <div className="flex">
                            <Slider value={temperature} className="mr-4" min={0} max={1} step={0.1} onValueChange={(value) => {
                                setTemperature(value)
                            }} />
                            <div className="flex items-center justify-center rounded-sm bg-secondary h-10 w-10 ">
                                {temperature}
                            </div>
                        </div>
                        <p className="text-muted-foreground text-sm">Controls the randomness of the output. 1 diverse and creative, 0 focused and deterministic.</p>
                    </div>
                    <Button type="button" disabled={dialogDisabled || prompt == ""} onClick={regenerateValue}>Regenerate <Sparkle className="h-6 w-6 text-background" /></Button>
                </DialogContent>
            </Dialog>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex flex-row items-center">                        
                                <FormLabel>Business Name</FormLabel>
                                <Button className="ml-4" type="button" onClick={() => {
                                    setSelectedField('name')
                                    setIsOpen(true);
                                    setTemperature([0.5])
                                }}>
                                    <Sparkle className="h-6 w-6 text-background" />
                                </Button>
                            </div>
                            <div className="flex flex-row">
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="slogan"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex flex-row items-center">                        
                                <FormLabel>Slogan</FormLabel>
                                <Button className="ml-4" type="button" onClick={() => {
                                    setSelectedField('slogan')
                                    setIsOpen(true);
                                    setTemperature([0.5]);
                                }}>
                                    <Sparkle className="h-6 w-6 text-background" />
                                </Button>
                            </div>
                            <div className="flex flex-row">
                                <FormControl>
                                    <Textarea className="resize-none !text-base" {...field} />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex flex-row items-center">
                                <FormLabel>Business Description</FormLabel>
                                <Button className="ml-4" type="button" onClick={() =>   {
                                        setSelectedField('description')
                                        setIsOpen(true);
                                        setTemperature([0.5]);
                                    }}>
                                    <Sparkle className="h-6 w-6 text-background" />
                                </Button>
                            </div>
                            <div className="flex flex-row items-center"> 
                                <FormControl>
                                    <Textarea className="resize-none !text-base" {...field} />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="flex flex-row justify-between">
                        <Button disabled={!isFormEdited || loading} type="submit">Save Changes</Button> 
                        <Button type="button" variant="secondary" disabled={!isFormEdited || loading} onClick={() => {
                            form.reset({
                                name: project.name,
                                description: project.description,
                                slogan: project.slogan,
                            })
                        }}>Reset Values</Button> 
                    </div>
                </form>
            </Form>
        </div>
    );
}
 
export default InfoForm;