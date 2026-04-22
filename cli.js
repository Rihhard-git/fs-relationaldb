require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
})

class Blog extends Model {}
Blog.init({
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})
Blog.sync()

app.use(express.json())

app.get('/api/blogs', async (req, res) => {
    const blogs = await Blog.findAll()
    res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
    try {
       const blog = await Blog.create(req.body)
        res.json(blog) 
    } catch (error) {
        return res.status(400).json({ error })
    }
    
})

app.delete('/api/blogs/:id', async (req, res) => {

    await Blog.destroy({
        where: {
            id: req.params.id
        }
    })
    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

/* const main = async () => {
    try {
        await sequelize.authenticate()
        const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
        blogs.map(b => console.log(`${b.author}: '${b.title}', ${b.likes} likes`))

        sequelize.close()
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}
 */
