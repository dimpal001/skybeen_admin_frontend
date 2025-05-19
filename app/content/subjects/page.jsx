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
import { Search, Plus, MoreHorizontal, Edit, Trash } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import AddEditModal from './AddEditModal'
import DeleteModal from '../../../components/DeleteComponent'
import axios from 'axios'
import { baseUrl } from '@/components/api'
import PaginationControls from '../../../components/Pagination'
import debounce from 'lodash/debounce'

export default function SubjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false)
  const [subjects, setSubjects] = useState([])
  const [loadingSubject, setLoadingSubject] = useState(true)
  const [page, setPage] = useState(0)
  const [take, setTake] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchSubjects = async (search = '') => {
    try {
      setLoadingSubject(true)
      const response = await axios.get(`${baseUrl}/subject/get-subjects`, {
        params: {
          page,
          take,
          search: search || undefined,
        },
      })
      setSubjects(response.data.subjects)
      setTotalCount(
        response.data.totalSubjects || response.data.subjects.length
      )
    } catch (error) {
      console.error('Error fetching subjects:', error)
    } finally {
      setLoadingSubject(false)
    }
  }

  const debouncedFetchSubjects = useCallback(
    debounce((query) => {
      fetchSubjects(query)
    }, 500),
    [page, take]
  )

  useEffect(() => {
    debouncedFetchSubjects(searchQuery)
    return () => debouncedFetchSubjects.cancel()
  }, [searchQuery, page, take, debouncedFetchSubjects])

  const handleDeleteSubject = async () => {
    try {
      setIsDeleting(true)
      await axios.delete(
        `${baseUrl}/subject/delete-subject?id=${selectedSubject.id}`
      )
      setShowDeleteModal(false)
      setSelectedSubject(null)
      fetchSubjects(searchQuery)
    } catch (error) {
      console.error('Error deleting subject:', error)
    } finally {
      setIsDeleting(false)
    }
  }

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
              placeholder='Search subjects...'
              className='pl-8'
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(0)
              }}
            />
          </div>
          <Button
            size='sm'
            onClick={() => {
              setSelectedSubject(null)
              setIsAddSubjectOpen(true)
            }}
          >
            <Plus className='mr-2 h-4 w-4' />
            Add Subject
          </Button>
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sl No.</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead>Topics</TableHead>
                <TableHead>Exams</TableHead>
                <TableHead className='w-[80px]'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingSubject ? (
                <TableRow>
                  <TableCell colSpan={4} className='h-24 text-center'>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : subjects.length > 0 ? (
                subjects.map((subject, index) => (
                  <TableRow key={subject.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className='font-medium'>
                      {subject.name}
                    </TableCell>
                    <TableCell>{subject?._count?.topics || 0}</TableCell>
                    <TableCell>{subject?._count?.exams || 0}</TableCell>
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
                              setSelectedSubject(subject)
                              setIsAddSubjectOpen(true)
                            }}
                          >
                            <Edit className='mr-2 h-4 w-4' />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedSubject(subject)
                              setShowDeleteModal(true)
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
                  <TableCell colSpan={4} className='h-24 text-center'>
                    No subjects found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <PaginationControls
          length={subjects.length}
          totalCount={totalCount}
          take={take}
          setTake={setTake}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
        />
      </div>

      <AddEditModal
        isOpen={isAddSubjectOpen}
        setOpen={setIsAddSubjectOpen}
        subject={selectedSubject}
        refreshSubjects={fetchSubjects}
      />
      <DeleteModal
        isOpen={showDeleteModal}
        setOpen={setShowDeleteModal}
        onDelete={handleDeleteSubject}
        isDeleting={isDeleting}
      />
    </DashboardLayout>
  )
}
