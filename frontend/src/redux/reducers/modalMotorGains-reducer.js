const initialState = {
    motorSelect: 'Motor eixo X',
    proportionalGain: 50,
    integralGain: 50,
    derivativeGain: 50,

    /*openSidebar: false,
    page: 'Monitoramento'*/
}

export const ModalMotorGains = (state = initialState, action) => {
    state = Object.assign({}, state)

    switch (action.type) {
        case 'SET_SELECT_MOTOR_AXIS':
            return {...state, motorSelect: action.motorSelect };
        case 'SET_PROPORTIONAL_GAIN':
            return {...state, proportionalGain: action.proportionalGain };
        case 'SET_INTEGRAL_GAIN':
            return {...state, integralGain: action.integralGain};
        case 'SET_DERIVATIVE_GAIN':
            return {...state, derivativeGain: action.derivativeGain};
        default:
            return {...state }
    }
}