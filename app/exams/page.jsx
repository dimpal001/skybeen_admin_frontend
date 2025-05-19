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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import axios from 'axios'
import { baseUrl } from '@/components/api'
import debounce from 'lodash/debounce'
import AddEditExamModal from './AddEditExamModal'

export default function ExamsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddEditExamModal, setShowAddEditExamModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [exams, setExams] = useState([])
  const [loadingExams, setLoadingExams] = useState(true)
  const [page, setPage] = useState(0)
  const [take, setTake] = useState(10)
  const [totalCount, setTotalCount] = useState(0)

  const fetchExams = async (search = '') => {
    try {
      setLoadingExams(true)
      const response = await axios.get(`${baseUrl}/exam/get-exams`, {
        params: {
          page,
          take,
          search: search || undefined,
        },
      })
      setExams(response.data.exams)
      setTotalCount(response.data.totalCount || response.data.exams.length)
    } catch (error) {
      console.error('Error fetching exams:', error)
    } finally {
      setLoadingExams(false)
    }
  }

  const debouncedFetchExams = useCallback(
    debounce((query) => {
      fetchExams(query)
    }, 500),
    [page, take]
  )

  useEffect(() => {
    debouncedFetchExams(searchQuery)
    return () => debouncedFetchExams.cancel()
  }, [searchQuery, page, take, debouncedFetchExams])

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
              placeholder='Search exams...'
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
              console.log(selectedItem)
              setSelectedItem(null)
              setShowAddEditExamModal(true)
            }}
          >
            <Plus className='mr-2 h-4 w-4' />
            Create Exam
          </Button>
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sl. No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className='w-[80px]'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingExams ? (
                <TableRow>
                  <TableCell colSpan={8} className='h-24 text-center'>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : exams.length > 0 ? (
                exams.map((exam, index) => (
                  <TableRow key={exam.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className='font-medium'>{exam.name}</TableCell>
                    <TableCell>{exam.subject.name}</TableCell>
                    <TableCell>{exam.class.name}</TableCell>
                    <TableCell>{exam.noOfQuestions || 0}</TableCell>
                    <TableCell>{exam.duration} min</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          exam.dificultyLevel === 'EASY'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : exam.dificultyLevel === 'MEDIUM'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}
                      >
                        {exam.dificultyLevel}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(exam.createdAt).toLocaleDateString()}
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
                          <DropdownMenuItem>
                            <Eye className='mr-2 h-4 w-4' />
                            <span>View</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(exam)
                              setShowAddEditExamModal(true)
                            }}
                          >
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
                  <TableCell colSpan={8} className='h-24 text-center'>
                    No exams found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>
              Showing {exams.length} of {totalCount} exams
            </span>
          </div>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-muted-foreground'>
                Rows per page:
              </span>
              <Select
                value={take.toString()}
                onValueChange={(value) => {
                  setTake(Number(value))
                  setPage(0) // Reset to first page when changing items per page
                }}
              >
                <SelectTrigger className='w-20'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='10'>10</SelectItem>
                  <SelectItem value='20'>20</SelectItem>
                  <SelectItem value='50'>50</SelectItem>
                  <SelectItem value='100'>100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={handlePrevious}
                disabled={page === 0}
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <span className='text-sm'>
                Page {page + 1} of {totalPages}
              </span>
              <Button
                variant='outline'
                size='sm'
                onClick={handleNext}
                disabled={page >= totalPages - 1 || totalPages === 0}
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AddEditExamModal
        isOpen={showAddEditExamModal}
        setOpen={setShowAddEditExamModal}
        exam={selectedItem}
      />
    </DashboardLayout>
  )
}
