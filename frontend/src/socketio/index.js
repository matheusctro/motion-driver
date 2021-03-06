import socketio from 'socket.io-client'
import { Store } from '../redux/store';

const DNS = 'http://localhost:3333'

const io = socketio.connect(DNS)

io.on('connection', () => {
    console.log('CONNECTED')
} )

io.on('/encoder', Data => {
    Store.dispatch({ type: 'SET_ENCODER', encoder: Data })
})

io.on('/status', Data =>{
    Store.dispatch({ type: 'SET_OPEN_MODAL_STATUS', openModalStatus: true });
    Store.dispatch({ type: 'SET_STATUS', status: Data });
})

io.on('/ack', Data =>{
    console.log(Data);
    Store.dispatch({ type: 'SET_COLOR_STATUS_VALUE', colorStatus: Data});
})

io.on('/CNC', Data =>{
    let print = "CNC " + Data + "!";
    Store.dispatch({ type: 'SET_OPEN_MODAL_STATUS', openModalStatus: true });
    Store.dispatch({ type: 'SET_STATUS', status: print });
})

export default io