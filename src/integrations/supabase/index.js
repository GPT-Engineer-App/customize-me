import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

import React from "react";
export const queryClient = new QueryClient();
export function SupabaseProvider({ children }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/* supabase integration types

### project

| name                | type                | format | required |
|---------------------|---------------------|--------|----------|
| project_id          | integer             | number | true     |
| project_name        | character varying   | string | true     |
| project_description | text                | string | false    |
| start_date          | date                | string | true     |
| end_date            | date                | string | false    |
| project_status      | character varying   | string | true     |

*/

export const useProjects = () => useQuery({
    queryKey: ['projects'],
    queryFn: () => fromSupabase(supabase.from('project').select('*')),
});

export const useProject = (projectId) => useQuery({
    queryKey: ['project', projectId],
    queryFn: () => fromSupabase(supabase.from('project').select('*').eq('project_id', projectId).single()),
});

export const useAddProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newProject) => fromSupabase(supabase.from('project').insert([newProject])),
        onSuccess: () => {
            queryClient.invalidateQueries('projects');
        },
    });
};

export const useUpdateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedProject) => fromSupabase(supabase.from('project').update(updatedProject).eq('project_id', updatedProject.project_id)),
        onSuccess: () => {
            queryClient.invalidateQueries('projects');
            queryClient.invalidateQueries(['project', updatedProject.project_id]);
        },
    });
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (projectId) => fromSupabase(supabase.from('project').delete().eq('project_id', projectId)),
        onSuccess: () => {
            queryClient.invalidateQueries('projects');
        },
    });
};

export const useUsers = () => useQuery({
    queryKey: ['users'],
    queryFn: () => fromSupabase(supabase.from('users').select('*')),
});

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedProfile) => fromSupabase(supabase.from('users').update(updatedProfile).eq('id', updatedProfile.id)),
        onSuccess: () => {
            queryClient.invalidateQueries('user');
        },
    });
};