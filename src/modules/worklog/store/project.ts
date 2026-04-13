import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

export interface Project {
    id: string
    userId: string
    name: string
    createdAt: string
    updatedAt: string
}

export interface ProjectOption {
    label: string
    value: string
}

export const useProjectStore = defineStore('project', () => {
    const authStore = useAuthStore()

    const projects = ref<Project[]>([])
    const loading = ref(false)

    const projectOptions = computed<ProjectOption[]>(() => {
        return projects.value.map((p) => ({
            label: p.name,
            value: p.id,
        }))
    })

    async function loadProjects() {
        const userId = authStore.user?.id
        if (!userId) return

        loading.value = true

        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        loading.value = false

        if (error) throw error

        projects.value = (data ?? []).map((p) => ({
            id: p.id,
            userId: p.user_id,
            name: p.name,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
        }))
    }

    async function createProject(name: string): Promise<Project> {
        const userId = authStore.user?.id
        if (!userId) throw new Error('No user')

        const { data, error } = await supabase
            .from('projects')
            .insert({
                user_id: userId,
                name,
            })
            .select()
            .single()

        if (error) throw error

        const project: Project = {
            id: data.id,
            userId: data.user_id,
            name: data.name,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        }

        projects.value.unshift(project)

        return project
    }

    return {
        projects,
        loading,
        projectOptions,
        loadProjects,
        createProject,
    }
})