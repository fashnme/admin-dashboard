export const isLoggedIn = () => {
    let loggedIn = false;
    try {
        loggedIn = window.localStorage["admin"] && JSON.parse(window.localStorage["lastLoggedin"]) + 86400000 * 2 > new Date().getTime()
    } catch (e) {
        loggedIn = false;
    }
    return loggedIn;
}