const initialState = {
    username: null,
};

export default function (state = initialState, action) {
    state = Object.assign({}, state);
    switch (action.type) {
        case 'LOGIN':
            try {
                console.log('teste entrando no login');
            } catch(error) {
                throw error;
            }
            break;
        case 'ON_LOGIN_ERROR':
            break;
        
        default:
            return { ...state } 
    }
}