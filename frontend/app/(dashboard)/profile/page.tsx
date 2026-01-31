"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, MapPin, Languages, Wheat, Calendar, LogOut, Save, Edit2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { getUserProfile, updateUserProfile, UserProfile } from "@/lib/api"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"

const languages = [
  { id: "English", name: "English", native: "English" },
  { id: "Hindi", name: "Hindi", native: "हिन्दी" },
  { id: "Marathi", name: "Marathi", native: "मराठी" },
]

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load profile data on mount
  useEffect(() => {
    async function loadProfile() {
      if (!user?.email) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const data = await getUserProfile(user.email)
        setProfile(data)
      } catch (err) {
        console.error("Failed to load profile:", err)
        setError("Failed to load profile data")
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [user?.email])

  const handleSave = async () => {
    if (!user?.email || !profile) return

    setIsSaving(true)
    setError(null)

    try {
      await updateUserProfile(user.email, {
        name: profile.name,
        state: profile.state,
        district: profile.district,
        village: profile.village,
        preferred_language: profile.preferred_language,
      })
      setIsEditing(false)
    } catch (err) {
      console.error("Failed to save profile:", err)
      setError("Failed to save changes. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="text-center">Loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="text-center text-destructive">
          {error || "Profile not found. Please complete onboarding."}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          size="sm"
          className="gap-2 rounded-lg"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          disabled={isSaving}
        >
          {isSaving ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : isEditing ? (
            <Save className="h-4 w-4" />
          ) : (
            <Edit2 className="h-4 w-4" />
          )}
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {/* Profile Card */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <User className="h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-xl">{profile.name || user?.displayName || "User"}</CardTitle>
              <CardDescription>{profile.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="h-4 w-4" />
              Personal Information
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name || ""}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="rounded-lg bg-muted"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MapPin className="h-4 w-4" />
              Location
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={profile.state || ""}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  disabled={!isEditing}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={profile.district || ""}
                  onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                  disabled={!isEditing}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="village">Village</Label>
                <Input
                  id="village"
                  value={profile.village || ""}
                  onChange={(e) => setProfile({ ...profile, village: e.target.value })}
                  disabled={!isEditing}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Crop Info */}
          {profile.has_farm_profile && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Wheat className="h-4 w-4" />
                Crop Information
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="crop">Current Crop</Label>
                  <Input
                    id="crop"
                    value={profile.crop || ""}
                    disabled
                    className="rounded-lg bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sowingDate">Sowing Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="sowingDate"
                      type="date"
                      value={profile.sowing_date || ""}
                      disabled
                      className="rounded-lg bg-muted"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Language */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Languages className="h-4 w-4" />
              Preferred Language
            </div>
            <div className="grid grid-cols-3 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => isEditing && setProfile({ ...profile, preferred_language: lang.id })}
                  disabled={!isEditing}
                  className={`rounded-xl border-2 p-3 text-center transition-all ${profile.preferred_language === lang.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                    } ${!isEditing ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                >
                  <div className="font-medium">{lang.native}</div>
                  <div className="text-xs text-muted-foreground">{lang.name}</div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            className="gap-2 rounded-lg"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
