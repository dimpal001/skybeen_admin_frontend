import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { baseUrl } from '../../components/api'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const AddEditExamModal = ({ isOpen, setOpen, exam = null }) => {
  const [subjects, setSubjects] = useState([])
  const [classes, setClasses] = useState([])
  const [languages, setLanguages] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    subjectId: '',
    classId: '',
    topic: '',
    language: '',
    dificultyLevel: '',
    duration: '',
    noOfQuestions: '',
    examDataRaw: '',
  })

  useEffect(() => {
    fetchSubjects()
    fetchClasses()
    fetchLanguages()
  }, [])

  useEffect(() => {
    console.log(exam)
    if (exam) {
      setFormData({
        name: exam.name || '',
        subjectId: exam.subjectId || '',
        classId: exam.classId || '',
        topic: exam.topic || '',
        language: exam.language || '',
        dificultyLevel: exam.dificultyLevel || '',
        duration: exam.duration || '',
        noOfQuestions: exam.noOfQuestions || '',
        examDataRaw: JSON.stringify(exam.examDataRaw || [], null, 2),
      })
    } else {
      setFormData({
        name: '',
        subjectId: '',
        classId: '',
        topic: '',
        language: '',
        dificultyLevel: '',
        duration: '',
        noOfQuestions: '',
        examDataRaw: '',
      })
    }
  }, [exam])

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`${baseUrl}/subject/get-subjects`)
      setSubjects(res.data.subjects)
    } catch {}
  }

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${baseUrl}/class/get-classes`)
      setClasses(res.data.classes)
    } catch {}
  }

  const fetchLanguages = async () => {
    try {
      const res = await axios.get(`${baseUrl}/language/get-all-languages`)
      setLanguages(res.data.languages)
    } catch {}
  }

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    const payload = {
      isShowcase: true,
      subjectId: formData.subjectId,
      classId: formData.classId,
      topic: formData.topic,
      language: formData.language,
      dificultyLevel: formData.dificultyLevel,
      duration: Number(formData.duration),
      noOfQuestions: Number(formData.noOfQuestions),
      examDataRaw: JSON.parse(formData.examDataRaw),
    }

    try {
      if (exam) {
        await axios.put(`${baseUrl}/exam/${exam.id}`, payload)
      } else {
        await axios.post(`${baseUrl}/exam/create-showcase-exam`, payload)
      }
      setOpen(false)
    } catch (error) {
      console.error('Error saving exam:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[800px]'>
        <DialogHeader>
          <DialogTitle>{exam ? 'Edit Exam' : 'Create New Exam'}</DialogTitle>
          <DialogDescription>
            {exam
              ? 'Update the exam details below.'
              : 'Create a new exam for students. Fill in the details below.'}
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>Exam Name</Label>
              <Input
                id='name'
                placeholder='Enter exam name'
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='topic'>Topic</Label>
              <Input
                id='topic'
                placeholder='Enter topic'
                value={formData.topic}
                onChange={(e) => handleChange('topic', e.target.value)}
              />
            </div>
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='subject'>Subject</Label>
              <Select
                value={formData.subjectId}
                onValueChange={(val) => handleChange('subjectId', val)}
              >
                <SelectTrigger id='subject'>
                  <SelectValue placeholder='Select subject' />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='class'>Class</Label>
              <Select
                value={formData.classId}
                onValueChange={(val) => handleChange('classId', val)}
              >
                <SelectTrigger id='class'>
                  <SelectValue placeholder='Select class' />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='language'>Language</Label>
              <Select
                value={formData.language}
                onValueChange={(val) => handleChange('language', val)}
              >
                <SelectTrigger id='language'>
                  <SelectValue placeholder='Select language' />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.id} value={lang.name}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='questions'>No. of Questions</Label>
              <Input
                id='questions'
                type='number'
                placeholder='e.g. 50'
                value={formData.noOfQuestions}
                onChange={(e) => handleChange('noOfQuestions', e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='duration'>Duration (minutes)</Label>
              <Input
                id='duration'
                type='number'
                placeholder='e.g. 120'
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='difficulty'>Difficulty Level</Label>
              <Select
                value={formData.dificultyLevel}
                onValueChange={(val) => handleChange('dificultyLevel', val)}
              >
                <SelectTrigger id='difficulty'>
                  <SelectValue placeholder='Select' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='EASY'>Easy</SelectItem>
                  <SelectItem value='MEDIUM'>Medium</SelectItem>
                  <SelectItem value='HARD'>Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='examData'>Exam Data (JSON format)</Label>
            <Textarea
              id='examData'
              placeholder='[{"question": "What is 2+2?", "optionA": "3", "optionB": "4", "optionC": "5", "optionD": "6", "correctAns": "B"}]'
              value={formData.examDataRaw}
              onChange={(e) => handleChange('examDataRaw', e.target.value)}
              className='min-h-[150px] font-mono text-sm'
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {exam ? 'Update Exam' : 'Create Exam'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddEditExamModal
