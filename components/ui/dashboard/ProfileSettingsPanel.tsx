"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword, logoutUser, updateUserProfile } from "@/lib/actions";
import { useUploadThing } from "@/utils/uploadthing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageOff, LogOut, Loader2, Upload } from "lucide-react";
import { CURRENCIES, currencyOptionLabel } from "@/lib/currencies";

type ProfileUser = {
   name: string | null;
   email: string | null;
   image: string | null;
   defaultCurrency: string;
   dashboardPeriod: number;
   themePreference: string;
   hiddenWidgets: string[];
};

const HIDE_WIDGET_OPTIONS = ["cashflow", "expenseBreakdown", "accountBalances", "topSpending", "recentTransactions"];

export default function ProfileSettingsPanel({ user }: { user: ProfileUser }) {
   const [profileState, profileAction] = useActionState(updateUserProfile, null);
   const [passwordState, passwordAction] = useActionState(changePassword, null);
   const [avatarUrl, setAvatarUrl] = useState(user.image || "");
   const fileInputRef = useRef<HTMLInputElement>(null);

   const { startUpload, isUploading } = useUploadThing("profileImage", {
      onClientUploadComplete: (res) => {
         const file = res?.[0] as { ufsUrl?: string; url?: string; appUrl?: string } | undefined;
         const url = file?.ufsUrl ?? file?.url ?? file?.appUrl;
         if (!url) {
            console.error("UploadThing response:", res);
            toast.error("Upload finished but no file URL was returned.");
            return;
         }
         setAvatarUrl(url);
         toast.success("Avatar uploaded. Click Save Profile to persist changes.");
      },
      onUploadError: (error) => {
         toast.error(error.message);
      },
   });

   const avatarInitials = (user.name || user.email || "")
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();

   useEffect(() => {
      if (profileState?.message) {
         if (profileState.success) toast.success(profileState.message);
         else toast.error(profileState.message);
      }
   }, [profileState]);

   useEffect(() => {
      if (passwordState?.message) {
         if (passwordState.success) toast.success(passwordState.message);
         else toast.error(passwordState.message);
      }
   }, [passwordState]);

   return (
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
         <Card className="border-border bg-card text-card-foreground">
            <CardHeader>
               <CardTitle>Personal Profile</CardTitle>
               <CardDescription className="text-muted-foreground">
                  Update account information and dashboard preferences.
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form action={profileAction} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                     <div className="space-y-2">
                        <Label htmlFor="profile-name" className="text-muted-foreground">
                           Name
                        </Label>
                        <Input
                           id="profile-name"
                           name="name"
                           required
                           defaultValue={user.name || ""}
                           className="bg-background border-input text-foreground"
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="profile-email" className="text-muted-foreground">
                           Email
                        </Label>
                        <Input
                           id="profile-email"
                           name="email"
                           type="email"
                           required
                           defaultValue={user.email || ""}
                           className="bg-background border-input text-foreground"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label className="text-muted-foreground">Avatar</Label>
                     <div className="flex items-center gap-4 rounded-lg border border-border bg-background/50 p-4">
                        <Avatar className="size-30 shrink-0 border border-border shadow-sm">
                           <AvatarImage src={avatarUrl || undefined} alt="Avatar preview" className="object-cover" />
                           <AvatarFallback className="bg-muted text-muted-foreground">
                              {avatarInitials || <ImageOff className="size-5" />}
                           </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-1 flex-col items-start gap-2">
                           <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(event) => {
                                 const file = event.target.files?.[0];
                                 if (file) startUpload([file]);
                                 event.target.value = "";
                              }}
                           />
                           <Button
                              type="button"
                              size="sm"
                              disabled={isUploading}
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-blue-600 text-white hover:bg-blue-700"
                           >
                              {isUploading ? (
                                 <Loader2 className="size-4 animate-spin" />
                              ) : (
                                 <Upload className="size-4" />
                              )}
                              {isUploading ? "Uploading…" : "Upload image"}
                           </Button>

                           {avatarUrl && (
                              <Button
                                 type="button"
                                 variant="outline"
                                 onClick={() => setAvatarUrl("")}
                              >
                                 Remove avatar
                              </Button>
                           )}

                           <p className="text-xs text-muted-foreground">PNG or JPG, up to 2MB.</p>
                        </div>
                     </div>

                     <div className="space-y-1.5">
                        <Label htmlFor="profile-image" className="text-xs text-muted-foreground">
                           Or paste an image URL
                        </Label>
                        <Input
                           id="profile-image"
                           name="image"
                           type="url"
                           value={avatarUrl}
                           onChange={(event) => setAvatarUrl(event.target.value)}
                           placeholder="https://..."
                           className="bg-background border-input text-foreground"
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                     <div className="space-y-2">
                        <Label htmlFor="defaultCurrency" className="text-muted-foreground">
                           Default Currency
                        </Label>
                        <select
                           id="defaultCurrency"
                           name="defaultCurrency"
                           required
                           defaultValue={user.defaultCurrency}
                           className="bg-background border border-input rounded-md h-10 px-3 text-sm text-foreground w-full"
                        >
                           {/* Keep any legacy value selectable so saving never silently changes it */}
                           {!CURRENCIES.some((c) => c.code === user.defaultCurrency) && (
                              <option value={user.defaultCurrency}>{user.defaultCurrency}</option>
                           )}
                           {CURRENCIES.map((c) => (
                              <option key={c.code} value={c.code}>
                                 {currencyOptionLabel(c)}
                              </option>
                           ))}
                        </select>
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="dashboardPeriod" className="text-muted-foreground">
                           Overview Period
                        </Label>
                        <select
                           id="dashboardPeriod"
                           name="dashboardPeriod"
                           defaultValue={String(user.dashboardPeriod)}
                           className="bg-background border border-input rounded-md h-10 px-3 text-sm text-foreground w-full"
                        >
                           <option value="30">30 days</option>
                           <option value="90">90 days</option>
                           <option value="365">365 days</option>
                        </select>
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="themePreference" className="text-muted-foreground">
                           Theme
                        </Label>
                        <select
                           id="themePreference"
                           name="themePreference"
                           defaultValue={user.themePreference}
                           className="bg-background border border-input rounded-md h-10 px-3 text-sm text-foreground w-full"
                        >
                           <option value="dark">Dark</option>
                           <option value="light">Light</option>
                           <option value="system">System</option>
                        </select>
                     </div>
                  </div>

                  <fieldset className="space-y-2 rounded-md border border-border p-3">
                     <legend className="px-1 text-sm text-muted-foreground">Hide Overview Widgets</legend>
                     <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {HIDE_WIDGET_OPTIONS.map((widget) => (
                           <label key={widget} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <input
                                 type="checkbox"
                                 name="hiddenWidgets"
                                 value={widget}
                                 defaultChecked={user.hiddenWidgets.includes(widget)}
                                 className="accent-blue-600"
                              />
                              {widget}
                           </label>
                        ))}
                     </div>
                  </fieldset>

                  <div className="flex justify-end">
                     <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                        Save Profile
                     </Button>
                  </div>
               </form>
            </CardContent>
         </Card>

         <Card className="border-border bg-card text-card-foreground">
            <CardHeader>
               <CardTitle>Security</CardTitle>
               <CardDescription className="text-muted-foreground">
                  Change your password or sign out of your account.
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <form action={passwordAction} className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="currentPassword" className="text-muted-foreground">
                        Current Password
                     </Label>
                     <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        required
                        className="bg-background border-input text-foreground"
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="newPassword" className="text-muted-foreground">
                        New Password
                     </Label>
                     <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        required
                        className="bg-background border-input text-foreground"
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="confirmPassword" className="text-muted-foreground">
                        Confirm New Password
                     </Label>
                     <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        className="bg-background border-input text-foreground"
                     />
                  </div>
                  <div className="flex justify-end">
                     <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                        Change Password
                     </Button>
                  </div>
               </form>

               <div className="border-t border-border pt-4">
                  <p className="mb-2 text-xs text-muted-foreground">Sign out of your account on this device.</p>
                  <form action={logoutUser}>
                     <Button
                        type="submit"
                        variant="outline"
                        className="w-full border-destructive/40 bg-background text-destructive hover:bg-destructive/10 hover:text-destructive"
                     >
                        <LogOut className="size-4" />
                        Log out
                     </Button>
                  </form>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
