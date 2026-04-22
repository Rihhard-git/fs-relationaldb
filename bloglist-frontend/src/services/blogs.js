import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = async newObject => {

    const config = {
        headers: { Authorization: token }
    }

    console.log('creating new blog', token)

    const response = await axios.post(baseUrl, newObject, config)
    return response.data

}

const update = async objectWithNewData => {

    const config = {
        headers: { Authorization: token }
    }

    console.log('updating new blog', objectWithNewData)
    const response = await axios.put(`${baseUrl}/${objectWithNewData.id}`, objectWithNewData, config)

    console.log(response)
}

const deleteBlog = async id => {

    const config = {
        headers: { Authorization: token }
    }
    console.log('trying to delete blog with id: ', id)

    const response = await axios.delete(`${baseUrl}/${id}`, config)

    console.log(response)

}

export default { getAll, create, setToken, update, deleteBlog }