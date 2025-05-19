'use client'

import { useEffect, useState, useCallback } from 'react'
import DashboardLayout from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash,
  Filter,
  Eye,
} from 'lucide-react'
import axios from 'axios'
import { baseUrl } from '@/components/api'
import debounce from 'lodash/debounce'
import PaginationControls from '@/components/Pagination'
import { useRouter } from 'next/navigation'

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [page, setPage] = useState(0)
  const [take, setTake] = useState(10)
  const [totalCount, setTotalCount] = useState(0)

  const router = useRouter()

  const fetchUsers = async (search = '') => {
    try {
      setLoadingUsers(true)
      const response = await axios.get(`${baseUrl}/user/get-users`, {
        params: {
          page,
          take,
          search: search || undefined,
        },
      })
      setUsers(response.data.users)
      setTotalCount(response.data.totalCount || response.data.users.length)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const debouncedFetchUsers = useCallback(
    debounce((query) => {
      fetchUsers(query)
    }, 500),
    [page, take]
  )

  useEffect(() => {
    debouncedFetchUsers(searchQuery)
    return () => debouncedFetchUsers.cancel()
  }, [searchQuery, page, take, debouncedFetchUsers])

  const totalPages = Math.ceil(totalCount / take)

  const handlePrevious = () => {
    if (page > 0) setPage(page - 1)
  }

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1)
  }

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='relative w-full sm:w-96'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search users...'
              className='pl-8'
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(0)
              }}
            />
          </div>
          <div className='flex items-center gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm'>
                  <Filter className='mr-2 h-4 w-4' />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>Active Users</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Inactive Users</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Premium Users</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Free Users</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size='sm' onClick={() => setIsAddUserOpen(true)}>
              <Plus className='mr-2 h-4 w-4' />
              Add User
            </Button>
          </div>
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className='w-[80px]'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingUsers ? (
                <TableRow>
                  <TableCell colSpan={7} className='h-24 text-center'>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className='font-medium'>
                      {user?.fullName}
                    </TableCell>
                    <TableCell>+91{user?.phoneNumber}</TableCell>
                    <TableCell>{user?.class?.name}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user?.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}
                      >
                        {user?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user?.plan?.plan?.name === 'Premium'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                            : user?.plan?.plan?.name === 'Standard'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {user?.plan?.plan?.name || 'Free'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(user?.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon'>
                            <MoreHorizontal className='h-4 w-4' />
                            <span className='sr-only'>Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              router.push(`/users/single-user/${user.id}`)
                            }}
                          >
                            <Eye className='mr-2 h-4 w-4' />
                            <span>View</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className='mr-2 h-4 w-4' />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash className='mr-2 h-4 w-4' />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className='h-24 text-center'>
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <PaginationControls
          length={users.length}
          take={take}
          setPage={setPage}
          setTake={setTake}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          page={page}
          totalCount={totalCount}
          totalPages={totalPages}
        />
      </div>

      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>Full Name</Label>
              <Input id='name' placeholder='Enter full name' />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='phone'>Phone Number</Label>
              <Input id='phone' placeholder='Enter phone number' />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='class'>Class</Label>
              <Select>
                <SelectTrigger id='class'>
                  <SelectValue placeholder='Select class' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='class-8'>Class 8</SelectItem>
                  <SelectItem value='class-9'>Class 9</SelectItem>
                  <SelectItem value='class-10'>Class 10</SelectItem>
                  <SelectItem value='class-11'>Class 11</SelectItem>
                  <SelectItem value='class-12'>Class 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='subscription'>Subscription Plan</Label>
              <Select>
                <SelectTrigger id='subscription'>
                  <SelectValue placeholder='Select plan' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='free'>Free</SelectItem>
                  <SelectItem value='basic'>Basic</SelectItem>
                  <SelectItem value='premium'>Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button type='submit'>Save User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
