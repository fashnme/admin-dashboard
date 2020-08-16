const sharedVariables = {
    // baseUrl: 'https://fashn-backend.herokuapp.com',
    baseUrl: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.localStorage["admin"]}`
    },
    cloud_name: 'patang1',
    upload_preset: 'fexcvybq'

}

export default sharedVariables;
