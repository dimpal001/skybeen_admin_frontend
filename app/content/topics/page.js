'use client'

import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  BookText,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import PaginationControls from '../../../components/Pagination'
import axios from 'axios'
import { baseUrl } from '@/components/api'
import { useRouter } from 'next/navigation'
import AddEditModal from './AddEditModal'
import PromptGenerator from './PromptGenerator'

// Custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export default function TopicsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPromptModal, setShowPromptModal] = useState(false)
  const [topics, setTopics] = useState([])
  const [totalTopics, setTotalTopics] = useState(0)
  const [page, setPage] = useState(0)
  const [take, setTake] = useState(10)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const totalPages = Math.ceil(totalTopics / take)
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Fetch topics from API
  const fetchTopics = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        `${baseUrl}/topic/fetch-topic?page=${page}&take=${take}&search=${searchQuery}`
      )
      setTopics(response.data.topics)
      setTotalTopics(response.data.totalTopics)
    } catch (error) {
      console.error('Error fetching topics:', error)
    } finally {
      setIsLoading(false)
    }
  }, [page, take, debouncedSearchQuery])

  useEffect(() => {
    fetchTopics()
  }, [fetchTopics])

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1)
  }

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1)
  }

  const filteredTopics = topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      topic.subject.name
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase()) ||
      topic.summary.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='relative w-full sm:w-96'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search topics...'
              className='pl-8'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className='flex items-center gap-2'>
            <Button size='sm' onClick={() => setShowPromptModal(true)}>
              Generate Promot
            </Button>
            <Button size='sm' onClick={() => setShowAddModal(true)}>
              <Plus className='mr-2 h-4 w-4' />
              Create Topic
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className='text-center'>Loading topics...</div>
        ) : (
          <>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {filteredTopics.length > 0 ? (
                filteredTopics.map((topic) => (
                  <Card key={topic.id}>
                    <CardHeader className='pb-2'>
                      <div className='flex items-start justify-between'>
                        <div>
                          <CardTitle className='text-lg'>
                            {topic.title}
                          </CardTitle>
                          <CardDescription>
                            {topic.subject.name}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8'
                            >
                              <MoreHorizontal className='h-4 w-4' />
                              <span className='sr-only'>Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                router.push(`/content/topics/${topic.id}`)
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
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className='text-sm text-muted-foreground line-clamp-3'>
                        {topic.summary}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className='col-span-full flex h-40 items-center justify-center rounded-md border border-dashed'>
                  <div className='flex flex-col items-center gap-1 text-center'>
                    <BookText className='h-10 w-10 text-muted-foreground/50' />
                    <h3 className='font-medium'>No topics found</h3>
                    <p className='text-sm text-muted-foreground'>
                      Try adjusting your search or create a new topic.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {totalTopics > 0 && (
              <PaginationControls
                length={filteredTopics.length}
                totalCount={totalTopics}
                take={take}
                setTake={setTake}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
              />
            )}
          </>
        )}
        <AddEditModal isOpen={showAddModal} setIsOpen={setShowAddModal} />
        <PromptGenerator
          isOpen={showPromptModal}
          setIsOpen={setShowPromptModal}
        />
      </div>
    </DashboardLayout>
  )
}
