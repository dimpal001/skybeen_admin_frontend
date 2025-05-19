'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { Label } from '@/components/ui/label'
import { Search, Plus, MoreHorizontal, Edit, Trash, Users } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import axios from 'axios'
import { baseUrl } from '@/components/api'
import PaginationControls from '../../../components/Pagination'
import debounce from 'lodash/debounce'
import AddEditModal from './AddEditModal'
import DeleteModal from '@/components/DeleteComponent'

export default function ClassesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showClassModal, setShowClassModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [classes, setClasses] = useState([])
  const [loadingClasses, setLoadingClasses] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [page, setPage] = useState(0)
  const [take, setTake] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [selectedClass, setSelectedClass] = useState(null)

  const fetchClasses = async (search = '') => {
    try {
      setLoadingClasses(true)
      const response = await axios.get(`${baseUrl}/class/get-classes`, {
        params: {
          page,
          take,
          search: search || undefined,
        },
      })
      setClasses(response.data.classes)
      setTotalCount(response.data.totalClasses || response.data.classes.length)
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setLoadingClasses(false)
    }
  }

  const debouncedFetchClasses = useCallback(
    debounce((query) => {
      fetchClasses(query)
    }, 500),
    [page, take]
  )

  useEffect(() => {
    debouncedFetchClasses(searchQuery)
    return () => debouncedFetchClasses.cancel()
  }, [searchQuery, page, take, debouncedFetchClasses])

  const totalPages = Math.ceil(totalCount / take)

  const handlePrevious = () => {
    if (page > 0) setPage(page - 1)
  }

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1)
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      const response = await axios.delete(
        `${baseUrl}/class/delete-class?id=${selectedClass.id}`
      )

      if (response.status === 200) {
        setShowDeleteModal(false)
        setSelectedClass(null)
        fetchClasses()
      }
    } catch {
      // Empty
    } finally {
      setDeleting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='relative w-full sm:w-96'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search classes...'
              className='pl-8'
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(0) // Reset to first page on search
              }}
            />
          </div>
          <Button
            size='sm'
            onClick={() => {
              setSelectedClass(null)
              setShowClassModal(true)
            }}
          >
            <Plus className='mr-2 h-4 w-4' />
            Add Class
          </Button>
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Name</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Exams</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead className='w-[80px]'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingClasses ? (
                <TableRow>
                  <TableCell colSpan={5} className='h-24 text-center'>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : classes.length > 0 ? (
                classes.map((cls) => (
                  <TableRow key={cls.id}>
                    <TableCell className='font-medium'>{cls.name}</TableCell>
                    <TableCell>{cls?._count?.user || 0}</TableCell>
                    <TableCell>{cls?._count?.exams || 0}</TableCell>
                    <TableCell>{cls?._count?.questions || 0}</TableCell>
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
                          <DropdownMenuItem>
                            <Users className='mr-2 h-4 w-4' />
                            <span>View Students</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedClass(cls)
                              setShowClassModal(true)
                            }}
                          >
                            <Edit className='mr-2 h-4 w-4' />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setShowDeleteModal(true)
                              setSelectedClass(cls)
                            }}
                          >
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
                  <TableCell colSpan={5} className='h-24 text-center'>
                    No classes found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <PaginationControls
          length={classes.length}
          totalCount={totalCount}
          take={take}
          setTake={setTake}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
        />

        <AddEditModal
          isOpen={showClassModal}
          setOpen={setShowClassModal}
          classData={selectedClass}
          refresh={fetchClasses}
        />

        <DeleteModal
          isOpen={showDeleteModal}
          setOpen={setShowDeleteModal}
          isDeleting={deleting}
          onDelete={handleDelete}
        />
      </div>
    </DashboardLayout>
  )
}
