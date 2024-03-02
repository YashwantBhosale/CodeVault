export const LOGIN = 'LOGIN';  
export const LOGOUT = 'LOGOUT';

export const login = (user) => {
    return {
        type: LOGIN,
        payload: user
    }
}