const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {

    return blogs.length === 0
    ? 0
    : blogs.reduce((sum, item) => sum + item.likes, 0) 

}
const favoriteBlog = (blogs) => {

    const sortedBlogs = blogs.toSorted((a, b) => b.likes - a.likes)

    return sortedBlogs[0]

}
const mostBlogs = (blogs) => {

    let result = _
        .chain(blogs)
        .countBy('author')
        .entriesIn()
        .max()
        .value()

    return { author: result[0], blogs: result[1]}

}

const mostLikes = (blogs) => {

    let result = _
        .chain(blogs)
        .flatMap((o) => {
            return { author: o.author,
                    likes: o.likes }
        })
        .value()

    const endresult = Object.values(result.reduce((value, object) => {
            if (value[object.author]) {
                value[object.author].likes += object.likes
            } else {
                value[object.author] = {...object}
            }
            return value
        }, {}))


    let maxLikes = endresult[0]

    endresult.forEach(e => {
        if (e.likes > maxLikes.likes) {
            maxLikes = e
        }
    })

    return maxLikes

}

module.exports = { 
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}