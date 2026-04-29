const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')
const Session = require('./session')

User.hasMany(Blog)
User.hasMany(ReadingList)
User.hasMany(Session)
Blog.belongsTo(User)
Blog.hasMany(ReadingList)
ReadingList.belongsTo(Blog)
ReadingList.belongsTo(User)
Session.belongsTo(User)


User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'readings' })

module.exports = { Blog, User, ReadingList, Session }