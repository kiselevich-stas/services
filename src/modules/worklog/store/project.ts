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

function normalizeProjectName(value: string): string {
    return value.trim().replace(/\s+/g, ' ')
}

export const useProjectStore = defineStore('project', () => {
    const authStore = useAuthStore()

    const projects = ref<Project[]>([])
    const loading = ref(false)

    const projectOptions = computed<ProjectOption[]>(() => {
        return projects.value.map((project) => ({
            label: project.name,
            value: project.id,
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

        projects.value = (data ?? []).map((project) => ({
            id: project.id,
            userId: project.user_id,
            name: project.name,
            createdAt: project.created_at,
            updatedAt: project.updated_at,
        }))
    }

    async function createProject(name: string): Promise<Project> {
        const userId = authStore.user?.id
        if (!userId) throw new Error('No user')

        const normalizedName = normalizeProjectName(name)

        const { data, error } = await supabase
            .from('projects')
            .insert({
                user_id: userId,
                name: normalizedName,
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

    async function findOrCreateProject(projectValue: string): Promise<Project> {
        const normalizedValue = normalizeProjectName(projectValue)

        if (!normalizedValue) {
            throw new Error('Project is required')
        }

        const existingById = projects.value.find(
            (project) => project.id === normalizedValue,
        )

        if (existingById) {
            return existingById
        }

        const existingByName = projects.value.find(
            (project) =>
                normalizeProjectName(project.name).toLocaleLowerCase() ===
                normalizedValue.toLocaleLowerCase(),
        )

        if (existingByName) {
            return existingByName
        }

        return createProject(normalizedValue)
    }

    return {
        projects,
        loading,
        projectOptions,
        loadProjects,
        createProject,
        findOrCreateProject,
    }
})