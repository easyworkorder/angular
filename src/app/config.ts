const hostname = window.location.hostname;

const api = {
    'localhost': 'http://localhost:8080/api/',
    'easyworkorder.herokuapp.com': 'https://easyworkorder.herokuapp.com/api/',
    'easyworkorderclient.herokuapp.com': 'https://easyworkorder.herokuapp.com/api/',
    'ewo-prod.com': ''
};

const config = {
    api: {
        base: api[hostname] || 'localhost',
        tokenLabel: 'Authorization',
        tokenValue: token => 'Jwt ' + token,
        contentType: 'application/json; charset=UTF-8',
        // contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    storage: {
        user: 'user', // storage key for user data
        token: 'token', // storage key for token (lets keep it separately)
        preferences: 'preferences',
    },
    preferences: {
    },
    routes: {
        signin: '/signin',
        signinRedirect: '/',
        signoutRedirect: '/signin',
    },

    notification: { // inspired by http://tamerayd.in/ngToast/
        interval: 3000, // refresh interval in milliseconds
        level: {
            values: {
                INFO: 'info', // aka 'default'
                SUCCESS: 'success',
                WARNING: 'warning',
                DANGER: 'danger',
                ERROR: 'error',
                WAIT: 'wait',

            },
        },
        type: {
            values: { // could be used directly as string values
                DEFAULT: 'DEFAULT',
                ERROR: 'ERROR',
                WARNING: 'WARNING',
                DATASET_UPLOAD: 'DATASET_UPLOAD',
            },
        },
        defaults: { // default per-item options
            dismissOnTimeout: true,
            timeout: 7000, // milliseconds
            dismissButton: false,
            dismissOnClick: true,
            onDismiss: null,
            //combineDuplications: false,
        }
    },
    messageType: {
        INFO: 'info', // aka 'default'
        SUCCESS: 'success',
        WARNING: 'warning',
        ERROR: 'error',
        WAIT: 'wait',
    }
}

export default config;
