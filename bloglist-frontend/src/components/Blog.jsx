import { useState } from 'react'

const Blog = (props) => {

    const [blog, setBlog] = useState(props.blog)
    const [showData, setShowData] = useState(false)
    const [buttonLabel, setButtonLabel] = useState('view')

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const handleLike = () => {
        const blogToUpdate = {
            ...blog, likes: blog.likes+1
        }
        try {
            props.update(blogToUpdate)
            setBlog(blogToUpdate)
            console.log('adding like')
        } catch {
            console.log('something went wrong!')
        }
    }
    const toggleShowData = () => {
        setShowData(!showData)
        buttonLabel === 'view' ? setButtonLabel('hide') : setButtonLabel('view')
    }
    const handleRemoveClick = () => {
        if(window.confirm(`Remove blog ${blog.title}`)) {
            console.log('trying to delete blog:', blog)
            props.deleteBlog(blog.id)
        }

    }

    return (

        <div className='blog' style={blogStyle}>
            <div>
                {blog.title}
                <button onClick={toggleShowData}>{buttonLabel}</button>
                {showData && <div>
                    {blog.url}<br/>
                    <span className='likes'>Likes: {blog.likes}</span>
                    <button onClick={handleLike}>like</button>
                    <br/>
                    {blog.author}
                    <br/>
                    {blog.user === props.user.id &&
                    <button onClick={handleRemoveClick}>remove</button>
                    }
                </div>}
            </div>
        </div>
    )
}

export default Blog