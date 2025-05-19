import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import axios from 'axios'
import { baseUrl } from '@/components/api'

const PromptGenerator = ({ isOpen, setIsOpen }) => {
  const [topicName, setTopicName] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [generatedPrompt, setGeneratedPrompt] = useState(null)
  const [subjects, setSubjects] = useState([])

  const languages = ['English', 'Spanish', 'French', 'German', 'Hindi']

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${baseUrl}/subject/get-subjects`)
      setSubjects(response.data.subjects)
    } catch {
      // Empty
    }
  }

  const handleGeneratePrompt = () => {
    if (!topicName.trim() || !selectedLanguage || !selectedSubject) return

    const prompt = `Write a detailed, well-structured explanation (including examples if needed) on the topic: "${topicName}" in the subject: "${selectedSubject}" using the language: "${selectedLanguage}".

Respond strictly in JSON format:
{
  "topicName": "A short 3-5 word topic name in English",
  "summary": "A brief summary of the topic in English",
  "content": "Main content using LaTeX where necessary"
}

Rules:
- Ensure the JSON is properly formatted and can be parsed correctly.
- Use LaTeX notation for mathematical expressions where applicable.
- The response should be clear, structured, and easy to understand.
`

    setGeneratedPrompt(prompt)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt)
  }

  useEffect(() => {
    fetchSubjects()
    setSelectedLanguage(null)
    setSelectedSubject(null)
    setGeneratedPrompt(null)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='sm:max-w-[800px]'>
        <DialogHeader>
          <DialogTitle>Generate a Structured Prompt</DialogTitle>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='grid gap-3 grid-cols-3'>
            <div className='grid gap-2'>
              <Label htmlFor='topic'>Topic Name</Label>
              <Input
                id='topic'
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                placeholder='Enter topic name'
                autoFocus
              />
            </div>

            <div className='grid gap-2'>
              <Label>Language</Label>
              <Select onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder='Select a language' />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang, index) => (
                    <SelectItem key={index} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='grid gap-2'>
              <Label>Subject</Label>
              <Select onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder='Select a subject' />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subj, index) => (
                    <SelectItem key={index} value={subj}>
                      {subj}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Display Prompt */}
          {generatedPrompt && (
            <div className='relative p-4 rounded-lg border text-sm mt-3'>
              <pre
                style={{
                  scrollbarWidth: 'none',
                }}
                className='whitespace-pre-wrap max-h-52 overflow-scroll scrollbar-hide'
              >
                {generatedPrompt}
              </pre>
              <button
                onClick={handleCopy}
                className='absolute top-2 right-2 text-gray-600 hover:text-gray-900'
              >
                <Copy size={18} />
              </button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleGeneratePrompt}
            disabled={
              !topicName.trim() || !selectedLanguage || !selectedSubject
            }
          >
            Generate Prompt
          </Button>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PromptGenerator
