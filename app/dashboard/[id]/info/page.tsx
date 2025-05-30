"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { useGlobalStore } from "@/store/useGlobalStore";
import { Project } from "@/type";
import InfoForm from "@/components/forms/info-form";
import Sidebar from "@/components/sidebar";

const ProjectPage = () => {
    const {id} = useParams();
    const router = useRouter();
    
    const { user } = useGlobalStore();
    const [loaded, setLoaded] = useState(false);
    const [project, setProject] = useState<Project>();

    useEffect(() => {
        if (!id || !user) return;

        //Fetch the selected project using the id in the url
        const fetchProject = async () => {
            const {data, error} = await supabase.from('projects').select('id, name, description, slogan, logo').eq('id', id).single();
            if (error) {
                console.error(error.message);
                router.push('/dashboard'); 
                return;
            }
            if (user) {
                //Save the project info using zustand variables
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
            <Sidebar projectId={id as string} selected={"info"} />
            <div className="ml-16 overflow-scroll min-h-screen w-screen">
                <InfoForm setProject={setProject} project={project} />
            </div>
        </>
    );

}
 
export default ProjectPage;