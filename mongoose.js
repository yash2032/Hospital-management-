const mongoose = require('mongoose');
const url = `mongodb+srv://hospital:hospital@cluster0.nlimo.mongodb.net/?retryWrites=true&w=majority`;
//const url = `mongodb+srv://doctor-allotment:doctor-allotment@cluster0.dq58e.mongodb.net/?retryWrites=true&w=majority`;

const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to the database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
    })
