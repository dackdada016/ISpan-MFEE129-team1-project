import io from 'socket.io-client'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Chat from './Chat'
import Swal from 'sweetalert2'

const socket = io.connect('http://localhost:3005')

function ChatStart() {
  const navigate = useNavigate()

  const [username, setUsername] = useState(localStorage.getItem('name') || '')
  const [room, setRoom] = useState(localStorage.getItem('id') || '')
  const [showChat, setShowChat] = useState(false)

  const [isAuthenticated, setIsAuthenticated] = useState(true)

  const joinRoom = () => {
    if (isAuthenticated) {
      if (username !== '' && room !== '') {
        socket.emit('join_room', room)
        setShowChat(true)
      }
    } else {
      Swal.fire('請先登入會員，即可開始聊天!', '', 'warning')
      // alert('請先登入會員，即可開始聊天')
      navigate('/login')
    }
  }

  useEffect(() => {
    setIsAuthenticated(!!username)
  }, [])

  return (
    <div className="top">
      {!showChat ? (
        <div className="joinChatContainer">
          <h2>加入對話</h2>
          <input
            type="text"
            placeholder="JOIN..."
            value={username}
            onChange={(event) => {
              setUsername(event.target.value)
            }}
          />
          <input
            type="text"
            placeholder="Room Id ...."
            value={room}
            hidden
            onChange={(event) => {
              setRoom(event.target.value)
            }}
          />
          <button onClick={joinRoom}>開始對話</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  )
}

export default ChatStart
