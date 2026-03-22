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
      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardHeader>
          <CardTitle>Personal Profile</CardTitle>
          <CardDescription className="text-slate-400">Update account information and dashboard preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={profileAction} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-name" className="text-slate-300">Name</Label>
                <Input id="profile-name" name="name" required defaultValue={user.name || ""} className="bg-slate-800 border-slate-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-email" className="text-slate-300">Email</Label>
                <Input id="profile-email" name="email" type="email" required defaultValue={user.email || ""} className="bg-slate-800 border-slate-700 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-image" className="text-slate-300">Avatar URL</Label>
              <Input id="profile-image" name="image" type="url" defaultValue={user.image || ""} placeholder="https://..." className="bg-slate-800 border-slate-700 text-white" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="defaultCurrency" className="text-slate-300">Default Currency</Label>
                <Input id="defaultCurrency" name="defaultCurrency" maxLength={3} defaultValue={user.defaultCurrency} className="bg-slate-800 border-slate-700 text-white uppercase" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dashboardPeriod" className="text-slate-300">Overview Period</Label>
                <select id="dashboardPeriod" name="dashboardPeriod" defaultValue={String(user.dashboardPeriod)} className="bg-slate-800 border border-slate-700 rounded-md h-10 px-3 text-sm text-white w-full">
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">365 days</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="themePreference" className="text-slate-300">Theme</Label>
                <select id="themePreference" name="themePreference" defaultValue={user.themePreference} className="bg-slate-800 border border-slate-700 rounded-md h-10 px-3 text-sm text-white w-full">
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>

            <fieldset className="space-y-2 rounded-md border border-slate-800 p-3">
              <legend className="px-1 text-sm text-slate-400">Hide Overview Widgets</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {HIDE_WIDGET_OPTIONS.map((widget) => (
                  <label key={widget} className="flex items-center gap-2 text-sm text-slate-300">
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

      <Card className="border-slate-800 bg-slate-900 text-white">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription className="text-slate-400">Change your password or sign out of your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={passwordAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-slate-300">Current Password</Label>
              <Input id="currentPassword" name="currentPassword" type="password" required className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-slate-300">New Password</Label>
              <Input id="newPassword" name="newPassword" type="password" required className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-300">Confirm New Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Change Password</Button>
            </div>
          </form>

          <div className="border-t border-slate-800 pt-4">
            <form action={logoutUser}>
              <Button type="submit" variant="outline" className="w-full border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700">
                Log out
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
