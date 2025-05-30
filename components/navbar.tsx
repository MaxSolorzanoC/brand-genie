"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect, useParams, useRouter } from "next/navigation";

import { Sparkles, ChevronsUpDown, Check, LogOut, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/store/useGlobalStore";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navbar = () => {
    const { user, projects, setProjects } = useGlobalStore();

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    const router = useRouter();

    const params = useParams();
    const id = params?.id ?? null; //If in the url we have a project id (/dashboard/[id] instead of just /dashboard) that means there is a selected project

    const [open, setOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState<string | null>(id as string | null)

    useEffect(() => {
        //Use the selected project id and add it to a state variable
        setSelectedProject(id as string | null)
    }, [id])

    useEffect(() => {
        //Fetch all projects from the user to display them in the dropdown menu
        const fetchProjects = async () => {
            if (!user) return;
            const res = await fetch(`/api/projects?userId=${user?.id}`)
            const data = await res.json();
            setProjects(data);
        };
        fetchProjects();
    }, [user])

    const signOut = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setProjects([])
        router.push('/login');
    }

    if (!isMounted) {
        //Prevent hydration errors
        return <></>;
    }
    
    return (
        <div className="sticky top-0 z-30 w-full bg-white h-[8vh] border-b-1 shadow-sm flex items-center justify-between flex-row">
            <div className="flex flex-row items-center h-full">
                <Sparkles onClick={() => router.push('/')} className="hover:cursor-pointer mx-4 h-10 w-8 text-primary" />
                <div onClick={() => router.push('/dashboard')} className=" z-0 hover:cursor-pointer hover:bg-secondary/80 px-2 sm:px-4 h-full items-center justify-center hidden sm:flex">
                    <p className="pr-2 text-base">{user?.name}</p> 
                    <div onClick={(e) => {
                        e.stopPropagation();
                        router.push('/pricing')
                    }} className={`z-10 hover:cursor-pointer ${user?.isPro ? 'bg-linear-120 from-accent to-accent/50 text-secondary': "bg-linear-120 from-primary/50 to-primary/80 text-secondary"} flex items-center justify-center rounded-3xl p-1 sm:p-2 px-2 sm:px-4 border-gray-500`}>
                        {user?.isPro ? "Pro" : "Free"}
                    </div>
                </div>
                <div className="mx-0 sm:mx-2 hidden sm:block">
                    /
                </div>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <div className="hover:bg-secondary/80 hover:cursor-pointer mx-2 px-2 sm:mx-0 sm:px-4 h-full flex items-center justify-center">
                            <p>{selectedProject
                            ? projects?.find((project) => project.id === selectedProject)?.name
                            : "Select Project"}</p>
                            <ChevronsUpDown className="sm:h-6 h-4 sm:w-6 w-4 text-primary/60 mx-2" />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                        <CommandList>
                            <CommandGroup>
                            {projects?.map((project) => (
                                <CommandItem
                                className="hover:cursor-pointer bg-background hover:bg-secondary/80"
                                key={project.id}
                                value={project.name}
                                onSelect={() => {
                                    setSelectedProject(project.id)
                                    setOpen(false)
                                    redirect(`/dashboard/${project.id}/info`)
                                }}
                                >
                                <Check
                                    className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedProject === project.id ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {project.name}
                                </CommandItem>
                            ))}
                            <CommandItem>
                            <Button variant="secondary" className="hover:cursor-pointer w-full" onClick={() => {
                                router.push('/new')
                            }}>New Project</Button>
                            </CommandItem>
                            </CommandGroup>
                        </CommandList>
                        </Command>
                    </PopoverContent>
                    </Popover>
            </div>
            <div className="flex flex-row items-center h-full ">
                <Button className="mr-8 hidden sm:block" onClick={() => router.push('/subscription')}>
                    Subscription
                </Button>
                <Button className="hover:cursor-pointer hover:bg-destructive/80 mr-4 hidden sm:flex" onClick={signOut} variant="destructive">
                    <LogOut />
                    <p>Sign Out</p>
                </Button>
                <div className="sm:hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="mr-4">
                            <Menu />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="mt-4 sm:hidden">
                            <DropdownMenuLabel>Menu</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem> 
                                <Link href="/dashboard">
                                    Dashboard
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href="/subscription">
                                    Subscription
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">
                                SignOut
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}
 
export default Navbar;