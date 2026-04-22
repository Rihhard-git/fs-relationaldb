import { useState } from 'react'

const BlogForm = ({ create }) => {

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        const blogObject = {
            title: title,
            author: author,
            url: url
        }
        console.log('adding new blog')
        create(blogObject)
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div>
            <h3>create new</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                    title:
                        <input
                            type="text"
                            value={title}
                            onChange={({ target }) => setTitle(target.value)}
                        />
                    </label>

                </div>
                <div>
                    <label>
                    author:
                        <input
                            type="text"
                            value={author}
                            onChange={({ target }) => setAuthor(target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                    url:
                        <input
                            type='text'
                            value={url}
                            onChange={({ target }) => setUrl(target.value)}
                        />
                    </label>
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm