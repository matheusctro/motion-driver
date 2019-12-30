import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import routes from './routes'

dotenv.config();

const app = express()
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(routes);

// app.get('/', (req, res) => {
//   res.json({status: 'Server is running!'})
// })

app.listen(process.env.PORT, () => console.log(`Listening on PORT ${process.env.PORT}`))

