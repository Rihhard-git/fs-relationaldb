import { useState } from 'react'
import loginService from '../services/login'



const LoginForm = ({ setUser, setToken, notify }) => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()
        console.log('logging in with', username, password)

        try {
            const user = await loginService.login({ username, password })
            setToken(user.token)
            setUser(user)
            window.localStorage.setItem(
                'loggedAppUser', JSON.stringify(user)
            )
            setUsername('')
            setPassword('')
        } catch {
            notify('wrong username or password', true)
            console.log('error happened loggin in')
        }
    }


    return (

        <div>
            <h2>Log in to application</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>
                        username
                        <input
                            type="text"
                            value={username}
                            onChange={( { target }) => setUsername(target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        password
                        <input
                            type="password"
                            value={password}
                            onChange={( { target }) => setPassword(target.value)}
                        />
                    </label>
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )

}

export default LoginForm