'use client'
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CardContent, Card, CardTitle, CardHeader, CardFooter } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { getDatabase, onValue, ref, set, update } from "firebase/database"
import { app } from "@/components/config/firebaseConfig"
export default function Home() {
  const database = getDatabase(app);
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [events, setEvents] = useState([])
  const [selectedUser, setSelectedUser] = useState([])
  const [selectedEvent, setSelectedEvent] = useState([])
  const [selectedEventName, setSelectedEventName] = useState('');

  const [abouts, setAbouts] = useState([{}])
  const [name, setName] = useState('')



  useEffect(() => {
    onValue(ref(database, 'users'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray = Object.entries(data || {}).map(([key, value]) => ({
          name: key,
          ispayed: value
        }));
        setUsers(dataArray);
        setFilteredUsers(dataArray);
      }
    })


    onValue(ref(database, 'Events'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const eventsArray = Object.keys(data).map((key) => {
          const event = data[key];
          return {
            eventName: key, // This is your event name e.g., 'testEvent'
            ...event.about,
          };
        });
        console.log(eventsArray);
        setEvents(eventsArray);
      }
    })
  }, [])

  const handleStudentSearch = (searchTerm) => {
    const filtered = users.filter((user) => {
      return user.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    setFilteredUsers(filtered);
  }


  const handleSelectedUser = (user) => {
    setSelectedUser(user);
  }

  const handleSelectedEvent = (eventName) => {
    setSelectedEventName(eventName);
  }
  

  const handleConfirm = () => {
    if (!selectedEventName || !selectedUser) {
      console.error("An event and user must be selected.");
      return;
    }
    
    const joinpplUpdate = {
      [selectedUser]: false
    };
    update(ref(database, 'Events/' + selectedEventName + '/joinppl'), joinpplUpdate);
  }
  

  
  

  return (
    <div key="1" className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="#">
              <Package2Icon className="h-6 w-6" />
              <span className="">Home - [{selectedUser}]</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <form>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  className="w-full bg-white shadow-none appearance-none pl-8 mx-auto dark:bg-gray-950"
                  placeholder="Search names..."
                  type="search"
                  onChange={(e) => handleStudentSearch(e.target.value)}
                />
              </div>
            </form>
            <nav className="grid items-start px-4 text-sm font-medium mt-4">
              <h2 className="font-semibold text-lg">Name</h2>
              <div className="grid grid-cols-1 gap-4 mt-4">
                {filteredUsers.map((user, index) => {
                  return (
                    <StudentObj key={index} name={user.name} ispaied={user.ispayed} selectUser={handleSelectedUser}/>
                  )
                })}
                


              </div>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Link className="lg:hidden" href="#">
            <Package2Icon className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  className="w-full bg-white shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3 dark:bg-gray-950"
                  placeholder="Search products..."
                  type="search"
                />
              </div>
            </form>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-lg md:text-xl">Events - [{selectedEventName}]</h1>
          </div>
          <div className="flex flex-col md:grid md:grid-cols-6 gap-6">
            <div className="md:col-span-4 lg:col-span-3 xl:col-span-4 flex flex-col gap-6">
              {events.map((event, index) => {

                return (
                  <EventObj key={index} name={event.title} date={event.date} time={event.time} location={event.Location} description={event.Description} selectEvent={() => handleSelectedEvent(event.eventName)} confirmEvent={handleConfirm}/>
                )
              })}
              
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


function Package2Icon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  )
}


function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}


function StudentObj({name, ispaied, selectUser}){
  const handleSelect = () => {
    selectUser(name);
  }
  return(
    <Card className="text-center">
      <CardContent>
        <h3 className="font-medium">{name}</h3>
        <p className="text-gray-500 dark:text-gray-400">학생회비 제출 여부: {ispaied ? "제출함" : "제출안함"}</p>
        <Button className="mt-2" size="sm" onClick={handleSelect}>
          Select
        </Button>
        
      </CardContent>
    </Card>
  )
}

function EventObj({name, date, time, location, description, selectEvent, confirmEvent}){
  const handleSelect = () => {
    selectEvent(name);
  }

  const handleConfirm = () => {
    confirmEvent();
  }


  return(
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <p className="text-sm text-gray-500">Status: Event not yet completed</p>
      </CardHeader>
      <CardContent>
        <p>Date: {date}</p>
        <p>Time: {time}</p>
        <p>Location: {location}</p>
        <p>Description: {description}</p>
      </CardContent>
      <CardFooter>
        <Button size="sm" onClick={handleSelect}>Select</Button>
        <Button size="sm" onClick={handleConfirm}>Confirm</Button>
      </CardFooter>
    </Card>
  )
}