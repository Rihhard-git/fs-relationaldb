import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Testing <Blog/>', () => {

    test('renders content', () => {

        const blog = {
            title: 'First blog for frontend testing',
            author: 'Testin Man',
            url: 'www.testing.com'
        }

        render(<Blog blog={blog} />)

        const element = screen.getByText('First blog for frontend testing')
        expect(element).toBeDefined()
    })

    test('clickin the "show" button shows more data', async () => {


        const blog = {
            title: 'First blog for frontend testing',
            author: 'Testing Man',
            url: 'www.testing.com'
        }

        render(<Blog blog={blog} />)

        const user = userEvent.setup()
        const button = screen.getByText('view')
        await user.click(button)

        /* screen.debug() */

        const author = screen.getByText('Testing Man', { exact: false })
        const url = screen.getByText('www.testing.com', { exact: false })
        const likes = screen.getByText('Likes', { exact: false })

        expect(author && url && likes).toBeDefined()

    })
    test('clicking like button twice', async () => {

        const clickLike = vi.fn()

        render(
            <button onClick={clickLike}>like</button>
        )

        const user = userEvent.setup()
        const button = screen.getByText('like')

        await user.click(button)
        await user.click(button)

        expect(clickLike.mock.calls).toHaveLength(2)

    })
})

