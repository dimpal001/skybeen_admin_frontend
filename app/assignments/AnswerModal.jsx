import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import { baseUrl } from '@/components/api'

const AnswerDialogue = ({ isOpen, setIsOpen, question }) => {
  const [answer, setAnswer] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setAnswer(question?.answer || '')
  }, [question])

  const handleSave = async () => {
    const data = {
      question: question?.content || '',
      answer,
    }

    try {
      const response = await axios.patch(`${baseUrl}/assignment`, {
        assignmentId: question.id,
        content: answer,
      })
      setIsOpen(false)
    } catch (error) {}
    setIsOpen(false)
  }

  const handleCopy = () => {
    const prompt = `data : {\n  question : ${JSON.stringify(
      question?.content || ''
    )},\n  answer: ${JSON.stringify(answer)}\n}`
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle>Answer the Question</DialogTitle>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label>Question</Label>
            <div className='p-4 border rounded-md max-h-60 overflow-y-auto bg-muted text-sm'>
              <ReactMarkdown>{question?.title || ''}</ReactMarkdown>
            </div>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='answer'>Answer</Label>
            <Textarea
              id='answer'
              placeholder={`data : {\n  question : Markdown question,\n  answer: Markdown answer\n}`}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={8}
            />
            <Button
              type='button'
              variant='outline'
              onClick={handleCopy}
              className={`w-fit flex gap-2 items-center self-end text-sm ${
                copied && 'text-green-500'
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Prompt'}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>Save Answer</Button>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AnswerDialogue
