import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)
    const [notification, setNotification] = useState({ message: null })

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs( blogs )
        )
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
        if(loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
        }
    }, [])
    const notifyWith = (message, isError = false) => {
        setNotification({ message, isError })
        setTimeout(() => {
            setNotification({ message: null })
        }, 5000)
    }
    const handleLogout = (e) => {
        e.preventDefault()
        notifyWith(`User ${user.name} succcesfully logged out`)
        setUser(null)
        window.localStorage.clear()
    }
    const addNewBlog = async (blogObject) => {

        blogService.setToken(user.token)

        try {
            const savedBlog = await blogService.create(blogObject)
            notifyWith(`a new blog ${savedBlog.title} added `)
            setBlogs(blogs.concat(savedBlog))
        } catch {
            notifyWith('Something went wrong adding new blog', true)
        }
    }
    const handleDelete = async (id) => {
        blogService.setToken(user.token)
        notifyWith('Blog deleted succesfully')
        try {
            await blogService.deleteBlog(id)
            setBlogs(blogs.filter(b => b.id !== id))
        } catch {
            notifyWith('Something went wrong deleting blog', true)
        }
    }

    return (
        <div>
            <h2>BlogApp</h2>
            <Notification notification={notification}/>
            {!user && <LoginForm setUser={setUser} setToken={blogService.setToken} notify={notifyWith}/>}
            {user &&
              <div>
                  <p>
                    Logged in as {user.name}
                      <button onClick={handleLogout}>logout</button>
                  </p>
                  <Togglable openLabel='create new blog' closeLabel='close'>
                      <BlogForm create={addNewBlog}/>
                  </Togglable>
                  <h3>blogs</h3>
                  {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
                      <Blog key={blog.id} blog={blog} update={blogService.update} deleteBlog={handleDelete} user={user}/>
                  )}
              </div>
            }
        </div>
    )
}

export default App