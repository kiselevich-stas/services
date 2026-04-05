import type {ActivityMode} from "../../types/weather.ts";
import type {ActivityConfig} from "../../types/activity.ts";

export const activityConfigMap: Record<ActivityMode, ActivityConfig> = {
    walk: {
        temperature: {ideal: 20, tolerance: 8, weight: 0.3},
        wind: {idealMax: 15, weight: 0.2},
        humidity: {min: 35, max: 65, weight: 0.15},
        precipitation: {idealMax: 20, weight: 0.2},
        air: {idealMax: 40, weight: 0.1},
        uv: {idealMax: 6, weight: 0.05},
    },
    run: {
        temperature: {ideal: 14, tolerance: 6, weight: 0.35},
        wind: {idealMax: 12, weight: 0.2},
        humidity: {min: 30, max: 55, weight: 0.2},
        precipitation: {idealMax: 15, weight: 0.15},
        air: {idealMax: 35, weight: 0.05},
        uv: {idealMax: 5, weight: 0.05},
    },
    travel: {
        temperature: {ideal: 22, tolerance: 10, weight: 0.2},
        wind: {idealMax: 18, weight: 0.15},
        humidity: {min: 30, max: 70, weight: 0.1},
        precipitation: {idealMax: 25, weight: 0.3},
        air: {idealMax: 50, weight: 0.15},
        uv: {idealMax: 7, weight: 0.1},
    },
    'remote-work': {
        temperature: {ideal: 21, tolerance: 10, weight: 0.15},
        wind: {idealMax: 25, weight: 0.05},
        humidity: {min: 30, max: 60, weight: 0.2},
        precipitation: {idealMax: 60, weight: 0.05},
        air: {idealMax: 30, weight: 0.4},
        uv: {idealMax: 8, weight: 0.15},
    },
    family: {
        temperature: {ideal: 21, tolerance: 7, weight: 0.25},
        wind: {idealMax: 10, weight: 0.2},
        humidity: {min: 35, max: 60, weight: 0.15},
        precipitation: {idealMax: 15, weight: 0.25},
        air: {idealMax: 35, weight: 0.1},
        uv: {idealMax: 4, weight: 0.05},
    },
}