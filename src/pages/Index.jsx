import React, { useState } from 'react';
import { useProjects, useAddProject, useUpdateProject, useDeleteProject } from '@/integrations/supabase/index.js';
import { PlusCircle, ListFilter, File, Edit, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const projectSchema = z.object({
  project_name: z.string().min(1, "Project name is required"),
  project_description: z.string().optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  project_status: z.string().min(1, "Project status is required"),
});

const Index = () => {
  const { data: projects, error, isLoading } = useProjects();
  const addProject = useAddProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const [selectedProject, setSelectedProject] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = async (data) => {
    if (selectedProject) {
      await updateProject.mutateAsync({ ...selectedProject, ...data });
      toast.success("Project updated successfully");
    } else {
      await addProject.mutateAsync(data);
      toast.success("Project added successfully");
    }
    reset();
    setSelectedProject(null);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    reset(project);
  };

  const handleDelete = async (projectId) => {
    await deleteProject.mutateAsync(projectId);
    toast.success("Project deleted successfully");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading projects: {error.message}</div>;

  return (
    <div className="p-4">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
              Archived
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Archived
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Project
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedProject ? "Edit Project" : "Add Project"}</DialogTitle>
                  <DialogDescription>
                    {selectedProject ? "Edit the details of your project." : "Add a new project to your list."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="project_name" className="text-right">
                        Project Name
                      </Label>
                      <Input id="project_name" {...register("project_name")} className="col-span-3" />
                      {errors.project_name && <p className="col-span-4 text-red-500">{errors.project_name.message}</p>}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="project_description" className="text-right">
                        Project Description
                      </Label>
                      <Input id="project_description" {...register("project_description")} className="col-span-3" />
                      {errors.project_description && <p className="col-span-4 text-red-500">{errors.project_description.message}</p>}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="start_date" className="text-right">
                        Start Date
                      </Label>
                      <Input id="start_date" type="date" {...register("start_date")} className="col-span-3" />
                      {errors.start_date && <p className="col-span-4 text-red-500">{errors.start_date.message}</p>}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="end_date" className="text-right">
                        End Date
                      </Label>
                      <Input id="end_date" type="date" {...register("end_date")} className="col-span-3" />
                      {errors.end_date && <p className="col-span-4 text-red-500">{errors.end_date.message}</p>}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="project_status" className="text-right">
                        Project Status
                      </Label>
                      <Input id="project_status" {...register("project_status")} className="col-span-3" />
                      {errors.project_status && <p className="col-span-4 text-red-500">{errors.project_status.message}</p>}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">{selectedProject ? "Update" : "Add"}</Button>
                    <DialogClose asChild>
                      <Button variant="outline" onClick={() => setSelectedProject(null)}>Cancel</Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                Manage your projects and view their details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.project_id}>
                      <TableCell>{project.project_name}</TableCell>
                      <TableCell>{project.project_description}</TableCell>
                      <TableCell>{project.start_date}</TableCell>
                      <TableCell>{project.end_date}</TableCell>
                      <TableCell>{project.project_status}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="icon" variant="outline" onClick={() => handleEdit(project)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="outline" onClick={() => handleDelete(project.project_id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>{projects.length}</strong> projects
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;