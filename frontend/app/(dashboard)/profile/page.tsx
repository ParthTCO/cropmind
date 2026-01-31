"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, MapPin, Languages, Wheat, Calendar, LogOut, Save, Edit2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialProfile = {
  name: "Ramesh Patil",
  phone: "+91 98765 43210",
  state: "Maharashtra",
  district: "Nashik",
  village: "Dindori",
  crop: "Wheat",
  sowingDate: "2024-12-01",
  language: "mr",
}

const languages = [
  { id: "en", name: "English", native: "English" },
  { id: "hi", name: "Hindi", native: "हिन्दी" },
  { id: "mr", name: "Marathi", native: "मराठी" },
]

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState(initialProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setIsEditing(false)
    }, 1000)
  }

  const handleLogout = () => {
    router.push("/")
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

      {/* Profile Card */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <User className="h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-xl">{profile.name}</CardTitle>
              <CardDescription>{profile.phone}</CardDescription>
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
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
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
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  disabled={!isEditing}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={profile.district}
                  onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                  disabled={!isEditing}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="village">Village</Label>
                <Input
                  id="village"
                  value={profile.village}
                  onChange={(e) => setProfile({ ...profile, village: e.target.value })}
                  disabled={!isEditing}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Crop Info */}
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
                  value={profile.crop}
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
                    value={profile.sowingDate}
                    disabled
                    className="rounded-lg bg-muted"
                  />
                </div>
              </div>
            </div>
          </div>

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
                  onClick={() => isEditing && setProfile({ ...profile, language: lang.id })}
                  disabled={!isEditing}
                  className={`rounded-xl border-2 p-3 text-center transition-all ${
                    profile.language === lang.id
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
