'use client'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { getDatabase, ref, set } from "firebase/database"
import { app } from "@/components/config/firebaseConfig"
import { useState } from "react"
import { v4 as uuidv4 } from 'uuid';

export default function Create() {

    const db = getDatabase(app)
    const eventRef = ref(db, 'Events');

    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [location, setLocation] = useState('')
    const [description, setDescription] = useState('')
    const [isClickable, setIsClickable] = useState(false)

    const handleAddEvent = () => {
        setIsClickable(true)
        const uid = uuidv4();
        set(ref(db, 'Events/' + uid), {
            title: title,
            date: date,
            time: time,
            location: location,
            description: description
        }).then(() => {}).catch((error) => {setIsClickable(false)})
    }


  return (
    <div key="1" className="grid grid-cols-2 gap-4 p-4">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Create Event</h1>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-title">Event Title</Label>
            <Input id="event-title" placeholder="Enter event title" onChange={(e) => {setTitle(e.target.value)}}/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-date">Date</Label>
              <Input id="event-date" type="date" onChange={(e) => {setDate(e.target.value)}}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-time">Time</Label>
              <Input id="event-time" type="time" onChange={(e) => {setTime(e.target.value)}} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-location">Location</Label>
            <Input id="event-location" placeholder="Enter event location" onChange={(e) => setLocation(e.target.value)}/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-description">Description</Label>
            <Textarea className="min-h-[100px]" id="event-description" placeholder="Enter event description" onChange={(e) => setDescription(e.target.value)}/>
          </div>
          <Button className="w-full" type="submit" onClick={handleAddEvent} disabled={isClickable}>
            Create Event
          </Button>
        </div>
      </div>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Event Preview</h1>
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <p className="text-sm text-gray-500">Status: Event not yet completed</p>
          </CardHeader>
          <CardContent>
            <p>Date: {date}</p>
            <p>Time: {time}</p>
            <p>Location: {location}</p>
            <p>Description: {description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

