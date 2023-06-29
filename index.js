require('dotenv').config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")

// Custom morgan token to display the data of arequest
morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))

// To get all entries in the phonebook
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// To get general informations about the API
app.get("/api/info", (request, response) => {
  const date = new Date()
  const lenght = persons.length
  response.send(
    `<p>Phonebook has info for ${lenght} people</p>
    <p>${date}</p>`
  )
})

// To get an individual entry by its ID
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((person) => {
    return person.id === id
  })
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// To delete a phonebook entry
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Route to POST a new phonebook entry
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
      name: body.name,
      number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT //|| 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


