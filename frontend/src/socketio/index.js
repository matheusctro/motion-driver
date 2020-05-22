import socketio from 'socket.io-client'
import { Store } from '../redux/store';

const DNS = 'http://localhost:3333'

const io = socketio.connect(DNS)

io.on('connection', () => {
    console.log('CONNECTED')
} )

io.on('/encoder', DataCue => {
    Store.dispatch({ type: 'SET_ENCODER', encoder: DataCue })
})

io.on('/status', DataCue => {
    console.log(DataCue);
})

export default io