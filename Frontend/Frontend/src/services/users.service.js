
const createUser = (first_name, last_name, username, password) => {
    console.log("Data received by createUser function:", first_name, last_name, username, password);

    return fetch ("http://localhost:3333/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "first_name": first_name, // 
            "last_name": last_name,
            "username": username,
            "password": password,
            
        })
    })
    .then((response) => {
        if(response.status === 201){
            return response.json();
        } else if(response.status === 400){
            throw "bad request";
        } else {
            throw "username already exists";
        }
    })
    .then((rJson) => {
        return rJson
    })
    .catch((error) => {
        console.log("Err", error)
        return Promise.reject(error)
    })
}

const login = (username, password) => {
    return fetch ("http://localhost:3333/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "username": username, 
            "password": password
        }),
    })
    .then((response) => {
        if(response.status === 200){
            return response.json();
        } else if(response.status === 400){
            throw "username or password incorrect";
        } else {
            throw "Something went wrong";
        }
    })
    .then((rJson) => {
        console.log("API Response:", rJson);
        localStorage.setItem("user_id", rJson.user_id);
        localStorage.setItem("session_token", rJson.session_token);
        return rJson;
    })
    .catch((error) => {
        console.log("Err", error)
        return Promise.reject(error)
    })
}

const logout = () => {
    return fetch("http://localhost:3333/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token"),
        },
    })
    .then((response) => {
        if (response.status === 200) {
            localStorage.removeItem("session_token");
            localStorage.removeItem("user_id");
            return;
        } else if (response.status === 401) {
            throw "Not logged in";
         } else {
            throw "Something went wrong";
        }
    })
    .catch((error) => {
        console.log("Err", error);
        return Promise.reject(error);
    });
}

export const userService = {
    createUser,
    login,
    logout
}