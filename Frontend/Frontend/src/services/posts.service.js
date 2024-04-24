const token = localStorage.getItem("session_token");

const getFeed = () => {
    return fetch("http://localhost:3333/feed")
    .then((response) => {
        if(response.status === 200){
            return response.json();
        } else{
            throw "Something went wrong";
        }
    })
    .then((resJson) => {
        return resJson
    })
    .catch((error) => {
        console.log("Err", error)
        return Promise.reject(error)
    })
}

const getSinglePost = (postId) => {
    return fetch(`http://localhost:3333/posts/${postId}`)
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw "Something went wrong";
            }
        })
        .then((resJson) => {
            return resJson;
        })
        .catch((error) => {
            console.log("Err", error);
            return Promise.reject(error);
        });
};

const addPost = (postText) => {
    return fetch("http://localhost:3333/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        },
        body: JSON.stringify({
            text: postText,
        }),
    })
        .then((response) => {
            if (response.status === 201) {
                return response.json();
            } else if (response.status === 401) {
                throw "Not logged in";
            } else if (response.status === 400) {
                throw "Bad request";
            } else {
                throw "Something went wrong";
            }
        })
        .then((resJson) => {
            return resJson;
        })
        .catch((error) => {
            console.log("Err", error);
            return Promise.reject(error);
        });
}

const deletePost = (postId) => {
    return fetch(`http://localhost:3333/posts/${postId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token"),
        },
    })
        .then((response) => {
            if (response.status === 200) {
                return;
            } else if (response.status === 401) {
                throw "Not logged in";
            } else if (response.status === 403) {
                throw "you can only delete your own posts";
            } else if (response.status === 404) {
                throw "Post not found";
            } else {
                throw "Something went wrong";
            }
        })
        .catch((error) => {
            console.log("Err", error);
            return Promise.reject(error);
        });
}

export const postService = {
    getFeed,
    getSinglePost,
    addPost,
    deletePost
}
