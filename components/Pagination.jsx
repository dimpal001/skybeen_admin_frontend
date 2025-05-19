import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const PaginationControls = ({
  length,
  totalCount,
  take,
  setTake,
  page,
  setPage,
  totalPages,
  handlePrevious,
  handleNext,
}) => {
  return (
    <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
      <div className='flex items-center gap-2'>
        <span className='text-sm text-muted-foreground'>
          Showing {length} of {totalCount} items
        </span>
      </div>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground'>Rows per page:</span>
          <Select
            value={take.toString()}
            onValueChange={(value) => {
              setTake(Number(value))
              setPage(0)
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
  )
}

export default PaginationControls
