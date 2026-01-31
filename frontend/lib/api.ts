"use client"

// API Service for CropMind AI
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Types
export interface DashboardSummary {
    current_stage: string;
    day_count: number;
    today_action: string;
    weather_summary: string;
    progress_percentage: number;
}

export interface WeatherData {
    temperature: number;
    feels_like: number;
    condition: string;
    humidity: number;
    wind_speed: number;
    rain_chance: number;
    rain_amount?: string;
    alert?: string;
}

export interface UserInfo {
    name: string;
    email: string;
    crop_type?: string;
    has_farm_profile: boolean;
    preferred_language: string;
}

export interface LifecycleStage {
    id: string;
    label: string;
    status: "completed" | "current" | "upcoming";
    date: string;
}

export interface LifecycleStatus {
    crop: string;
    sowing_date: string;
    day_count: number;
    current_stage: string;
    total_days: number;
    progress_percentage: number;
    timeline: LifecycleStage[];
    history: string[];
    error?: string;
}

// API Functions
export async function getDashboardSummary(email: string): Promise<DashboardSummary> {
    const response = await fetch(`${API_URL}/dashboard/summary?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
        throw new Error("Failed to fetch dashboard summary");
    }
    return response.json();
}

export async function getWeather(email: string): Promise<WeatherData> {
    const response = await fetch(`${API_URL}/dashboard/weather?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
        throw new Error("Failed to fetch weather data");
    }
    return response.json();
}

export async function getUserInfo(email: string): Promise<UserInfo> {
    const response = await fetch(`${API_URL}/dashboard/user-info?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
        throw new Error("Failed to fetch user info");
    }
    return response.json();
}

export async function getLifecycleStatus(email: string): Promise<LifecycleStatus> {
    const response = await fetch(`${API_URL}/lifecycle/status?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
        throw new Error("Failed to fetch lifecycle status");
    }
    return response.json();
}

// Helper to get time-based greeting
export function getTimeBasedGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
}

// User Profile API
export interface UserProfile {
    email: string;
    name?: string;
    preferred_language: string;
    phone?: string;
    state?: string;
    district?: string;
    village?: string;
    crop?: string;
    sowing_date?: string;
    has_farm_profile: boolean;
}

export async function getUserProfile(email: string): Promise<UserProfile> {
    const response = await fetch(`${API_URL}/user/profile?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
        throw new Error("Failed to fetch user profile");
    }
    return response.json();
}

export async function updateUserProfile(email: string, data: Partial<UserProfile>): Promise<void> {
    const response = await fetch(`${API_URL}/user/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, ...data }),
    });
    if (!response.ok) {
        throw new Error("Failed to update user profile");
    }
}

// Alerts API
export interface Alert {
    id: number;
    type: string;
    message: string;
    severity: string;
    created_at: string;
}

export async function getAlerts(email: string): Promise<Alert[]> {
    const response = await fetch(`${API_URL}/alerts/?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
        throw new Error("Failed to fetch alerts");
    }
    return response.json();
}

// Chat API
export interface ChatMessage {
    answer: string;
    stage: string;
    actionable_steps: string[];
}

export async function sendChatMessage(email: string, question: string): Promise<ChatMessage> {
    const response = await fetch(`${API_URL}/chat/query`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_email: email,
            question: question
        }),
    });
    if (!response.ok) {
        throw new Error("Failed to send chat message");
    }
    return response.json();
}
// Onboarding API
export interface OnboardingData {
    user_email: string;
    crop: string;
    sowing_date: string;
    state: string;
    district: string;
    village: string;
    preferred_language: string;
}

export async function submitOnboarding(data: OnboardingData): Promise<void> {
    const response = await fetch(`${API_URL}/onboarding/setup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to submit onboarding data");
    }
}
