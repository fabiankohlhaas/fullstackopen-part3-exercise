const mongoose = require('mongoose')

let name, number

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length===3) {
  console.log('phonebook:')
}

if (process.argv.length>3) {
  name = process.argv[3].replace(/"/,'')
  number = process.argv[4]
}

const password = process.argv[2]

const url =
    `mongodb+srv://fullstack:${password}@fso-c1.6aqry4p.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length===3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      if (person.number) {
        console.log(person.name, person.number)
      } else {
        console.log(person.name)
      }
    })
    mongoose.connection.close()
  }).catch(err => console.error(err))
}

if (process.argv.length>3) {
  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  }).catch(err => console.error(err))
}
