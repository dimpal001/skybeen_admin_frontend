"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, MoreHorizontal, Trash, Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddNotificationOpen, setIsAddNotificationOpen] = useState(false)

  // Mock data - in a real app, you would fetch this from your API
  const notifications = [
    {
      id: "1",
      title: "New Exam Available",
      message: "A new Mathematics exam is now available. Check it out!",
      recipients: "All Users",
      sentAt: "2023-05-15T10:30:00",
      read: 2145,
    },
    {
      id: "2",
      title: "App Update",
      message: "We have released a new version of the app with exciting features.",
      recipients: "All Users",
      sentAt: "2023-06-22T14:15:00",
      read: 1876,
    },
    {
      id: "3",
      title: "New Topic Added",
      message: "We have added a new topic on Chemical Bonding. Start learning now!",
      recipients: "Chemistry Students",
      sentAt: "2023-07-10T09:45:00",
      read: 543,
    },
    {
      id: "4",
      title: "Subscription Reminder",
      message: "Your subscription is about to expire. Renew now to continue learning.",
      recipients: "Premium Users",
      sentAt: "2023-08-05T16:20:00",
      read: 328,
    },
    {
      id: "5",
      title: "Challenge Invitation",
      message: "You have been invited to a challenge by a classmate. Accept now!",
      recipients: "Selected Users",
      sentAt: "2023-09-18T11:10:00",
      read: 12,
    },
  ]

  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.recipients.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notifications..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button size="sm" onClick={() => setIsAddNotificationOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Send Notification
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="w-[300px]">Message</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Sent Date</TableHead>
                <TableHead>Read Count</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell className="font-medium">{notification.title}</TableCell>
                    <TableCell className="truncate max-w-[300px]">{notification.message}</TableCell>
                    <TableCell>{notification.recipients}</TableCell>
                    <TableCell>{new Date(notification.sentAt).toLocaleString()}</TableCell>
                    <TableCell>{notification.read.toLocaleString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Bell className="mr-2 h-4 w-4" />
                            <span>Resend</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No notifications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isAddNotificationOpen} onOpenChange={setIsAddNotificationOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send New Notification</DialogTitle>
            <DialogDescription>Create a new notification to send to users.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Notification Title</Label>
              <Input id="title" placeholder="Enter notification title" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Enter notification message" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="recipients">Recipients</Label>
              <Select>
                <SelectTrigger id="recipients">
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="premium">Premium Users</SelectItem>
                  <SelectItem value="free">Free Users</SelectItem>
                  <SelectItem value="inactive">Inactive Users</SelectItem>
                  <SelectItem value="custom">Custom Selection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="screen">Target Screen (Optional)</Label>
              <Select>
                <SelectTrigger id="screen">
                  <SelectValue placeholder="Select target screen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home Screen</SelectItem>
                  <SelectItem value="exams">Exams Screen</SelectItem>
                  <SelectItem value="topics">Topics Screen</SelectItem>
                  <SelectItem value="profile">Profile Screen</SelectItem>
                  <SelectItem value="subscription">Subscription Screen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddNotificationOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Send Notification</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

