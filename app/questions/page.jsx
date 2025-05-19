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
import { Search, Eye, Filter, MoreVertical, Trash } from 'lucide-react'
import axios from 'axios'
import { baseUrl } from '@/components/api'
import DeleteModal from '@/components/DeleteComponent'
import debounce from 'lodash/debounce'
import PaginationControls from '@/components/Pagination'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import AnswerModal from './AnswerModal'

export default function QuestionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [questions, setQuestions] = useState([])
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [showAnswerModal, setShowAnswerModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [page, setPage] = useState(0)
  const [take, setTake] = useState(10)
  const [totalCount, setTotalCount] = useState(0)

  const router = useRouter()

  const fetchQuestions = async (search = '') => {
    try {
      setLoadingQuestions(true)
      const response = await axios.get(`${baseUrl}/question`, {
        params: {
          page,
          take,
          search: search || undefined,
        },
      })
      setQuestions(response.data.questions)
      setTotalCount(
        response.data.totalQuestions || response.data.questions.length
      )
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoadingQuestions(false)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await axios.delete(`${baseUrl}/question?id=${selectedItem.id}`)
      setQuestions((prevQuestions) =>
        prevQuestions.filter((item) => item.id != selectedItem.id)
      )
      setTotalCount((totalCount) => totalCount - 1)
      setShowDeleteModal(false)
    } catch (error) {
    } finally {
      setDeleting(false)
    }
  }

  const debouncedFetchQuestions = useCallback(
    debounce((query) => {
      fetchQuestions(query)
    }, 500),
    [page, take]
  )

  const serialNumber = (index, currentPage, itemsPerPage) => {
    return currentPage * itemsPerPage + index + 1
  }

  useEffect(() => {
    debouncedFetchQuestions(searchQuery)
    return () => debouncedFetchQuestions.cancel()
  }, [searchQuery, page, take, debouncedFetchQuestions])

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
              placeholder='Search questions...'
              className='pl-8'
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(0)
              }}
            />
          </div>
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
              <DropdownMenuItem>Answered</DropdownMenuItem>
              <DropdownMenuItem>Unanswered</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop Table */}
        <div className='hidden md:block rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sl. No.</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Chapter</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className='w-[80px]'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingQuestions ? (
                <TableRow>
                  <TableCell colSpan={8} className='h-24 text-center'>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : questions.length > 0 ? (
                questions.map((q, index) => (
                  <TableRow key={q.id}>
                    <TableCell>{serialNumber(index, page, take)}</TableCell>
                    <TableCell className='max-w-[200px] truncate'>
                      <ReactMarkdown>{q.content}</ReactMarkdown>
                      {/* {q.content} */}
                    </TableCell>
                    <TableCell>{q.class?.name || '—'}</TableCell>
                    <TableCell>{q.subject?.name || '—'}</TableCell>
                    <TableCell>{q.chapter?.name || '—'}</TableCell>
                    <TableCell>{q.marks ?? '—'}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          q.isAnswerd
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}
                      >
                        {q.isAnswerd ? 'Answered' : 'Unanswered'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(q.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='icon'>
                            <MoreVertical className='h-4 w-4' />
                            <span className='sr-only'>Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(q)
                              setShowAnswerModal(true)
                            }}
                          >
                            <Eye className='mr-2 h-4 w-4' />
                            Answer
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedItem(q)
                              setShowDeleteModal(true)
                            }}
                            className='text-red-600 focus:bg-red-50 dark:focus:bg-red-900'
                          >
                            <Trash className='mr-2 h-4 w-4' />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className='h-24 text-center'>
                    No questions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className='space-y-4 md:hidden'>
          {loadingQuestions ? (
            <p className='text-center text-sm text-muted-foreground'>
              Loading...
            </p>
          ) : questions.length > 0 ? (
            questions.map((q) => (
              <div
                key={q.id}
                className='rounded-lg border p-4 shadow-sm bg-card text-card-foreground space-y-1'
              >
                <p className='text-sm font-medium'>{q.content}</p>
                <p className='text-xs text-muted-foreground'>
                  Class: {q.class?.name || '—'} | Subject:{' '}
                  {q.subject?.name || '—'}
                </p>
                <p className='text-xs text-muted-foreground'>
                  Chapter: {q.chapter?.name || '—'} | Marks: {q.marks ?? '—'}
                </p>
                <div className='flex justify-between items-center pt-1'>
                  <span
                    className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
                      q.isAnswerd
                        ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}
                  >
                    {q.isAnswerd ? 'Answered' : 'Unanswered'}
                  </span>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => router.push(`/questions/${q.id}`)}
                  >
                    <Eye className='h-4 w-4' />
                  </Button>
                </div>
                <p className='text-xs text-right text-muted-foreground'>
                  {new Date(q.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className='text-center text-sm text-muted-foreground'>
              No questions found.
            </p>
          )}
        </div>

        <PaginationControls
          length={questions.length}
          take={take}
          setPage={setPage}
          setTake={setTake}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          page={page}
          totalCount={totalCount}
          totalPages={totalPages}
        />
        {showAnswerModal && (
          <AnswerModal
            isOpen={showAnswerModal}
            setIsOpen={setShowAnswerModal}
            question={selectedItem}
            refresh={() => fetchQuestions()}
          />
        )}
        {showDeleteModal && (
          <DeleteModal
            isOpen={true}
            isDeleting={deleting}
            onDelete={handleDelete}
            setOpen={() => setShowDeleteModal(false)}
            title='Delete this question ?'
          />
        )}
      </div>
    </DashboardLayout>
  )
}
