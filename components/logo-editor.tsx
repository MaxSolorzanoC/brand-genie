import { useEffect, useRef, useState } from "react";

import { CirclePlus, Download, Sparkle, Trash2 } from "lucide-react";

import { Project } from "@/type";
import { supabase } from "@/lib/supabase";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ConfirmationDialog from "./dialogs/confirmation-dialog";
import { downloadImage } from "@/lib/downloadImage";

type Props = {
  project: Project;
  setProject: (data: Project) => void;
}

const LogoEditor = ({ project, setProject }: Props) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>();
  const [open, setOpen] = useState(false);

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
    //Close alert dialog once confirm button is pressed
    setOpen(false)
    setLoading(true);
    const res = await fetch('/api/remove-logo', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: project.id, //project id
        url: project.logo, //Image file locations
      }),
    });

    if(!res.ok) {
      const {error} = await res.json();
      console.error(error);
      return;
    };
         
    const {data} = await res.json();

    console.log(data)
    setProject(data);
    setPublicUrl(null);
    toast.success("Logo deleted successfully!");


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
      console.error(error);
      return
    } else {
      //If response is not an error
      //Get the returned url
      const {data} = await res.json();
      //Set updated project
      setProject(data)
      //Get the public url of that returned url and set the state variable
      const newPublicUrl = supabase.storage.from("images").getPublicUrl(data.logo).data.publicUrl;
      setPublicUrl(newPublicUrl);
    }

    setPrompt('');
    setLoading(false);
  }

  return (
    <>
      <ConfirmationDialog onRemoveLogo={removeLogo} open={open} setOpen={setOpen} onClose={() => setOpen(false)} />
      <div className="bg-white p-8 xl:px-12 rounded-2xl shadow-xl mx-12 my-8">
        <h1 className="font-medium text-neutral-600 text-2xl md:text-3xl mb-4 md:mb-8">Logo Editor</h1>            
        <div className="flex justify-around flex-col md:flex-row">
          <div className="md:mr-12 flex flex-col items-center">
            <div onClick={() => {
              //On click focus the textarea
              textAreaRef.current?.focus();
            }} className="self-center mb-0 hover:bg-neutral-300/80 cursor-pointer h-64 w-64 lg:h-96 lg:w-96 bg-neutral-300 flex items-center justify-center rounded-lg">
              {loading ? 
                (
                  <p>Loading...</p>
                ) : publicUrl ? (
                  //Open dialog when delete button is clicked
                  <div className="relative h-full w-full group" onClick={() => setOpen(true)}>
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
            {publicUrl && <div className="grid grid-cols-2 gap-8 mt-4 md:hidden">
              <Button disabled={loading} onClick={async () => {
                setLoading(true)
                if(project.logo) {
                  await downloadImage({
                    url: project.logo,
                    downloadUrl: `${project.name}.jpg`
                  });
                } else {
                  console.error("There is no logo for this project")
                }
                setLoading(false)
              }} className="w-28" variant="secondary">
                <Download />
              </Button>
              <Button disabled={loading} onClick={() => setOpen(true)} className="w-28" variant="destructive">
                <Trash2 />
              </Button>
            </div>}
            {
              publicUrl && <Button disabled={loading} onClick={async () => {
                if(project.logo) {
                  await downloadImage({
                    url: project.logo,
                    downloadUrl: `${project.name}.jpg`
                  });
                } else {
                  console.error("There is no logo for this project")
                }
              }} variant="secondary" className="hidden md:flex w-full mt-8 cursor-pointer"><Download />Download Logo</Button>
            }
          </div>
          <div className="flex flex-1 flex-col mt-8 md:mt-0">
            <Textarea disabled={loading} value={prompt} onChange={(e) => {
              setPrompt(e.target.value)
            }} placeholder="Give instructions on how you want your logo to look like. Give details like color palette, minimalist/modern/classic style, icon ideas, typography preferences, etc." ref={textAreaRef} className="resize-none !text-base lg:!text-xl flex-1" />
            <Button disabled={loading} onClick={generateLogo} className="mt-4 md:mt-8 lg:text-lg cursor-pointer">{project.logo ? "Regenerate Logo" : "Generate Logo" }<Sparkle className="h-6 w-6 text-background" /></Button>
          </div>
        </div>
      </div>
    </>
  );
}
 
export default LogoEditor;