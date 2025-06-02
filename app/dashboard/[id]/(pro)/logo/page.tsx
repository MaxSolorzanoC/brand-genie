"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Project } from "@/type";
import { supabase } from "@/lib/supabase";
import { useGlobalStore } from "@/store/useGlobalStore";
import LogoEditor from "@/components/logo-editor";
import Sidebar from "@/components/sidebar";

const ProjectPage = () => {
    //The selected project id
    const {id} = useParams();
    
    const { user } = useGlobalStore();
    const [loaded, setLoaded] = useState(false)
    const [project, setProject] = useState<Project>()

    useEffect(() => {
        if (!id || !user) return;
        //Get the current selected project info using the id
        const fetchProject = async () => {
            const {data, error} = await supabase.from('projects').select('id, name, description, slogan, logo').eq('id', id).single();
            if (error) {
                console.error(error.message) 
                return;
            }
            if (data && user) {
                setProject({
                    ...data,
                    userId: user?.id,
                })
            }
            setLoaded(true)
        }
        fetchProject(); 
    }, [id, user])

    if (!loaded) return (
        <p>Loading...</p>    
    )

    if (!project) {
        return <p>No project selected</p>
    }

    return (
        <>
            <Sidebar projectId={id as string} selected={"logo"} />
            <div className="ml-16 overflow-scroll min-h-screen w-screen">
                <LogoEditor project={project} setProject={setProject} />
            </div>
        </>
    );

}
 
export default ProjectPage;