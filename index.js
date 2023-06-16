const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

// Custom morgan token to display the data of arequest
morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
]

// To get all entries in the phonebook
app.get("/api/persons", (request, response) => {
  response.json(persons)
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
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(note => note.id !== id)

  response.status(204).end()
})

// To generate IDs for HTTP POST
const generateId = () => {
  const newId = Math.floor(Math.random() * (10000 - 10) + 10)

  return newId
}

// Route to POST a new phonebook entry
app.post('/api/persons', (request, response) => {
const body = request.body

  if (!body.name) {
      return response.status(400).json({ 
      error: 'name missing' 
      })
  }

  if (!body.number) {
    return response.status(400).json({ 
    error: 'number missing' 
    })
  }

  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({ 
    error: 'name must be unique' 
    })
  }

  const person = {
      id: generateId(),
      name: body.name,
      number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
