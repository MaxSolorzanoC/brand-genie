"use client"

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { PlusCircle } from "lucide-react";

import { useGlobalStore } from "@/store/useGlobalStore";
import ProjectCard from "@/components/project-card";
import { Button } from "@/components/ui/button";
import UnauthorizedDialog from "@/components/unauthorized-dialog";
 
const DashboardPage = () => {
    const searchParams = useSearchParams();
    const params = searchParams.get('q');
    //If user was redirected to search param q (e.g. "/dashboard?q=unauthorized") means user tried to enter an unowned project
        
    const router = useRouter();
    const { user, setProjects, projects } = useGlobalStore();

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if(params) {
            //If params is not null (user tried to enter unowned project) open dialog
            setOpen(true);
        }
    }, [params])

    useEffect(()=> {
        //Fetch the current user projects using the user id
        const fetchProjects = async () => {
            if (!user) return
            const res = await fetch(`/api/projects`);
            const projects = await res.json();
            setProjects(projects)
        };
        fetchProjects();
    }, [user])

    return (
        <>
            <UnauthorizedDialog open={open} setOpen={setOpen} title="Unauthorized" description="You do not have access to this project" />
            <div className="flex flex-col w-full h-full">
                {projects && projects?.length > 0 ?
                    //If we have at least 1 project, load the user projects 
                    (
                        <section className="grid grid-cols-1 w-full md:grid-cols-2 xl:grid-cols-3 gap-12 p-12 items-center justify-center">
                            {
                                projects.map((project) => (
                                    <ProjectCard project={project} key={project.id} />
                                ))
                            }
                            <Link href={`/new`} className=" rounded-xl p-12 bg-white hover:bg-white/50 shadow-lg">
                                <PlusCircle size={64} className="m-auto h-full text-black/60" />
                            </Link>

                        </section>
                    )
                    :
                    //User has no projects
                    (
                        <section className="w-full h-9/10 flex flex-col justify-center items-center ">
                            <p className="opacity-70 pb-2">You have no projects</p>
                            <p className="opacity-70 pb-4">Create a new project to get started</p>
                            <Button className="hover:cursor-pointer" onClick={() => {
                                router.push('/new')
                            }}>New Project</Button>
                        </section>
                    )
                }
            </div>
        </>
    );
}
 
export default DashboardPage;