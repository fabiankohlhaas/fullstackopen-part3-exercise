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
app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
  .catch(error => next(error))
})

// TODO To get general informations about the API
app.get("/api/info", (request, response) => {
  const date = new Date()
  const lenght = persons.length
  response.send(
    `<p>Phonebook has info for ${lenght} people</p>
    <p>${date}</p>`
  )
})

// TODO To get an individual entry by its ID
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
app.post('/api/persons', (request, response, next) => {
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
  .catch(error => next(error))
})

// To update an existing entry
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person =  {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new:true})
    .then(updatePerson =>  {
      response.json(updatePerson)
    })
    .catch(error => next(error))
  })


const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformated id'})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


