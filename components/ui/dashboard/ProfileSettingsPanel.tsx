"use client";

import React, { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword, logoutUser, updateUserProfile } from "@/lib/actions";

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
          <CardDescription className="text-muted-foreground">Update account information and dashboard preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={profileAction} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-name" className="text-muted-foreground">Name</Label>
                <Input id="profile-name" name="name" required defaultValue={user.name || ""} className="bg-background border-input text-foreground" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-email" className="text-muted-foreground">Email</Label>
                <Input id="profile-email" name="email" type="email" required defaultValue={user.email || ""} className="bg-background border-input text-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-image" className="text-muted-foreground">Avatar URL</Label>
              <Input id="profile-image" name="image" type="url" defaultValue={user.image || ""} placeholder="https://..." className="bg-background border-input text-foreground" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="defaultCurrency" className="text-muted-foreground">Default Currency</Label>
                <Input id="defaultCurrency" name="defaultCurrency" maxLength={3} defaultValue={user.defaultCurrency} className="bg-background border-input text-foreground uppercase" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dashboardPeriod" className="text-muted-foreground">Overview Period</Label>
                <select id="dashboardPeriod" name="dashboardPeriod" defaultValue={String(user.dashboardPeriod)} className="bg-background border border-input rounded-md h-10 px-3 text-sm text-foreground w-full">
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">365 days</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="themePreference" className="text-muted-foreground">Theme</Label>
                <select id="themePreference" name="themePreference" defaultValue={user.themePreference} className="bg-background border border-input rounded-md h-10 px-3 text-sm text-foreground w-full">
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
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Save Profile</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription className="text-muted-foreground">Change your password or sign out of your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={passwordAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-muted-foreground">Current Password</Label>
              <Input id="currentPassword" name="currentPassword" type="password" required className="bg-background border-input text-foreground" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-muted-foreground">New Password</Label>
              <Input id="newPassword" name="newPassword" type="password" required className="bg-background border-input text-foreground" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-muted-foreground">Confirm New Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required className="bg-background border-input text-foreground" />
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Change Password</Button>
            </div>
          </form>

          <div className="border-t border-border pt-4">
            <form action={logoutUser}>
              <Button type="submit" variant="outline" className="w-full border-input bg-background text-foreground hover:bg-accent">
                Log out
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
