import { useEffect, useRef, useState } from "react";

import { CirclePlus, Sparkle, Trash2 } from "lucide-react";

import { Project } from "@/type";
import { supabase } from "@/lib/supabase";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {
  project: Project;
}

const LogoEditor = ({ project }: Props) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>();

  useEffect(() => {
    //Get the project logo public url
    if (project.logo) {
      //If project has an existing logo get public url
      const publicUrl = supabase.storage
          .from("images")
          .getPublicUrl(project.logo).data.publicUrl;
      setPublicUrl(publicUrl);
    } else {
      //If project doesn't have a logo set to null
      setPublicUrl(null);
    }
  }, [])

  const removeLogo = async () => {
    setLoading(true);
    alert("TODO: remove logo");
    //TODO: Add a button to delete logo on mobile
    setLoading(false);
  }

  const generateLogo = async () => {
    setLoading(true);
    const res = await fetch("/api/generate-logo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        id: project.id, 
        description: project.description,
        name: project.name,
        slogan: project.slogan,
        logo: project.logo
      }),
    });   
    if (!res.ok) {
      const {error} = await res.json();
      console.error(error)
    } else {
      //If response is not an error
      //Get the returned url
      const {url} = await res.json();
      //Get the public url of that returned url and set the state variable
      const newPublicUrl = supabase.storage.from("images").getPublicUrl(url).data.publicUrl;
      setPublicUrl(newPublicUrl);
    }

    setPrompt('');
    setLoading(false);
  }

  return (
    <div className="bg-white p-8 xl:px-12 rounded-2xl shadow-xl mx-12 my-8">
      <h1 className="font-medium text-neutral-600 text-3xl mb-10">Logo Editor</h1>            
      <div className="flex justify-around flex-col md:flex-row">
        <div onClick={() => {
          //On click focus the textarea
          textAreaRef.current?.focus();
        }} className="self-center md:mb-0 mb-8 md:mr-12 hover:bg-neutral-300/80 cursor-pointer h-64 w-64 lg:h-96 lg:w-96 bg-neutral-300 flex items-center justify-center rounded-lg">
          {loading ? 
            (
              <p>Loading...</p>
            ) : publicUrl ? (
              <div className="relative h-full w-full group" onClick={removeLogo}>
                <img src={publicUrl} className="h-full w-full object-contain" />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 flex items-center justify-center">
                  <Trash2 size={64} color="white" />
                </div>
              </div>
            ) : (
              <CirclePlus className="m-auto opacity-50" size={64} color="black" />
            ) 
          }
        </div>
        <div className="flex flex-1 flex-col">
          <Textarea disabled={loading} value={prompt} onChange={(e) => {
            setPrompt(e.target.value)
          }} placeholder="Give instructions on how you want your logo to look like. Give details like color palette, minimalist/modern/classic style, icon ideas, typography preferences, etc." ref={textAreaRef} className="resize-none !text-base lg:!text-xl flex-1" />
          <Button disabled={loading} onClick={generateLogo} className="mt-8 lg:text-lg">{project.logo ? "Regenerate Logo" : "Generate Logo" }<Sparkle className="h-6 w-6 text-background" /></Button>
        </div>
      </div>
    </div>
  );
}
 
export default LogoEditor;