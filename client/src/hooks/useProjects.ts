import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Project, ProjectStatus } from '../types';

export function useProjects(status?: ProjectStatus | 'all') {
  return useQuery({
    queryKey: ['projects', status || 'all'],
    queryFn: () =>
      api.get<Project[]>(
        status && status !== 'all' ? `/projects?status=${status}` : '/projects'
      ),
  });
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: ['projects', 'detail', id],
    queryFn: () => api.get<Project>(`/projects/${id}`),
    enabled: !!id,
  });
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: ProjectStatus;
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string } & UpdateProjectInput) =>
      api.patch<Project>(`/projects/${id}`, input),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      qc.invalidateQueries({ queryKey: ['projects', 'detail', vars.id] });
    },
  });
}
