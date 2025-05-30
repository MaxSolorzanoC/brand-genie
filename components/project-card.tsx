import React, { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "@/lib/supabase";
import { Project } from "@/type";

type Props = {
    project: Project,
}


const ProjectCard = ({ project }:Props) => {
    const [publicUrl, setPublicUrl] = useState<string>();

    useEffect(() => {
        //Get the project logo public url
        if(project.logo) {
            const url = supabase.storage.from("images").getPublicUrl(project.logo).data.publicUrl;
            setPublicUrl(url)
        }
    }, [])

    return (
        <Link href={`/dashboard/${project.id}/info`} className="bg-white shadow-lg rounded-xl flex flex-row items-center justify-between sm:p-8 p-4 hover:scale-105 transition-all duration-300 w-96  md:w-full m-auto">
            <div className="bg-gray-500 h-20 sm:h-28 w-20 sm:w-28 rounded-full">
                {publicUrl && (
                    <img className="h-full w-full rounded-full" src={publicUrl} />
                )}
            </div>
            <div className="w-1/2">
                <p className="text-center text-base sm:text-lg md:text-xl ml-4">
                    {project.name}
                </p>
            </div>
        </Link>
    );
}
 
export default ProjectCard;