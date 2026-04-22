import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

describe('<BlogForm />', () => {

    test('BlogForm tries to add new blog with right data', async () => {

        const user = userEvent.setup()
        const addBlog = vi.fn()

        render(<BlogForm create={addBlog} />)

        screen.debug()

        const title = screen.getByLabelText('title:')
        const author = screen.getByLabelText('author:')
        const url = screen.getByLabelText('url:')
        const button = screen.getByText('create')

        await user.type(title, 'Testing title input...')
        await user.type(author, 'Testing author input...')
        await user.type(url, 'Testing url input...')

        await user.click(button)

        console.log(addBlog.mock.calls[0][0])

        expect(addBlog.mock.calls).toHaveLength(1)
        expect(addBlog.mock.calls[0][0].title).toBe('Testing title input...')
        expect(addBlog.mock.calls[0][0].author).toBe('Testing author input...')
        expect(addBlog.mock.calls[0][0].url).toBe('Testing url input...')
    })
})
