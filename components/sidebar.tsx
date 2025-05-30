import Link from "next/link";
import { useState } from "react";

import { CircleFadingPlus, FilePenLine, Image } from "lucide-react";

import ComingSoonDialog from "@/components/coming-soon-dialog";

type Props = {
    selected: string, //Used to show which is the current section
    projectId: string, //Used to redirect to a dynamic route
}

const Sidebar = ({ selected, projectId }: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <>  
            {/* When posts page is clicked, open dialog */}
            <ComingSoonDialog open={open} setOpen={setOpen} /> 
            <div className="absolute left-0 h-[92vh] overflow-hidden text-primary/70 shadow-lg z-50">
                <div className="group group w-16 transition-all hover:w-48 bg-white h-full duration-300">
                    {/* If selected is "info" (when user is in info page) make element darker*/}
                    <Link href={`/dashboard/${projectId}/info`} className={`w-full flex flex-row justify-start items-center ${selected === "info" && "bg-secondary"} hover:bg-secondary h-16`}>
                        <FilePenLine className="min-w-16 h-16 p-4"></FilePenLine>
                        <p className="flex justify-center items-center w-full scale-x-0 group-hover:scale-x-100 transition-all duration-300 h-24 origin-left text-sm whitespace-nowrap text-center">Business Info</p>
                    </Link>
                    {/* If selected is "logo" (when user is in logo editor) make element darker*/}
                    <Link href={`/dashboard/${projectId}/logo`} className={`w-full flex flex-row justify-start items-center ${selected === "logo" && "bg-secondary"} hover:bg-secondary h-16`}>
                        <Image className="min-w-16 h-16 p-4"></Image>
                        <p className="flex justify-center items-center w-full scale-x-0 group-hover:scale-x-100 transition-all duration-300 h-24 origin-left text-sm whitespace-nowrap text-center">Logo Editor</p>
                    </Link>
                    <div onClick={() => setOpen(true)} className={`cursor-pointer w-full flex flex-row justify-start items-center ${selected === "posts" && "bg-secondary"} hover:bg-secondary h-16`}>
                        <CircleFadingPlus className="min-w-16 h-16 p-4"></CircleFadingPlus>
                        <p className="flex justify-center items-center w-full scale-x-0 group-hover:scale-x-100 transition-all duration-300 h-24 origin-left text-sm whitespace-nowrap text-center">Post Generator</p>
                    </div>
                </div>
            </div>
        </>
    );
}
 
export default Sidebar;