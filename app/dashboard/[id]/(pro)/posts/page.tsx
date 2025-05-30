"use client"

import Sidebar from "@/components/sidebar";
import { useParams } from "next/navigation";


const ProjectPage = () => {
    const {id} = useParams();

    return (
        <>
            <Sidebar projectId={id as string} selected={"posts"} />
            <div className="ml-16 overflow-scroll min-h-screen w-screen">
                Page on development
            </div>
        </>
    );

}
 
export default ProjectPage;