const signup = async () => {
    const signup_username = document.getElementById("signup-username").value;
    const signup_password = document.getElementById("signup-password").value;

    try {
        const res = await axios.post("http://localhost:3000/signup", {
            username: signup_username,
            password: signup_password,
        });
        if (res.data.message) {
            M.toast({
                html: `${res.data.message} is signed up`,
                classes: 'rounded'
            });
            setTimeout(() => window.location.href = './signin.html', 1000)
        } else if (res.data.error.issues) {
            M.toast({
                html: `${res.data.error.issues[0].message} `,
                classes: 'rounded'
            });
        } else if (res.data.error) {
            console.log(res.data.error);
            M.toast({
                html: `${res.data.error}`,
                classes: 'rounded',
            });
        }
    } catch (error) {
        M.toast({
            html: 'not able to sign in',
            classes: 'rounded'
        });
        console.log("catch error is " + error);
    }

}

const signin = async () => {
    const signin_username = document.getElementById("signin-username").value;
    const signin_password = document.getElementById("signin-password").value;


    try {
        const res = await axios.post("http://localhost:3000/signin", {
            username: signin_username,
            password: signin_password,
        });
        if (res.data.message) {
            M.toast({
                html: `${res.data.message} is signed in`,
                classes: 'rounded'
            });
            localStorage.setItem("token", res.data.token);
            setTimeout(() => window.location.href = './index.html', 1000)
        } else if (res.data.error.issues) {
            M.toast({
                html: `${res.data.error.issues[0].message} `,
                classes: 'rounded'
            });
        } else if (res.data.error) {
            console.log(res.data.error);
            M.toast({
                html: `${res.data.error}`,
                classes: 'rounded'
            });
        }
    } catch (error) {
        M.toast({
            html: 'not able to sign in',
            classes: 'rounded'
        });
        console.log("catch error is" + error);
    }

}

const addtodo = async () => {
    const token = localStorage.getItem("token");
    const title = document.getElementById("todo-input-title").value;
    const desc = document.getElementById("todo-input-desc").value;

    try {
        const res = await axios.post("http://localhost:3000/addtodo", {
            title: title,
            desc: desc
        }, {
            headers: {
                token: token
            }
        })
        if (res.data.message) {
            M.toast({
                html: `${res.data.message}`,
                classes: 'rounded toast-container',
                

            });
            gettodo();
        } else if (res.data.error.issues) {

            M.toast({
                html: `${res.data.error.issues[0].message} `,
                classes: 'rounded'
            });
        } else if (res.data.error) {
            M.toast({
                html: `${res.data.error}`,
                classes: 'rounded'
            });
        }

    } catch (error) {
        M.toast({
            html: 'not able to add todo',
            classes: 'rounded'
        });
        console.log("catch error for add todo" + error);
    }
}

const gettodo = async () => {
    const token = localStorage.getItem("token");
    try {
        const res = await axios.get("http://localhost:3000/gettodo", {
            headers: {
                token: token
            }
        });
        const data = res.data.todos;
        const todosList = await data.map((todo) => `
            <li class="todo-list">${todo.title} <p class="todo-desc">${todo.desc}</p> <button onclick="deletetodo('${todo._id}')">delete</button> ${todo.done == true ? "completed" : "not completed"} <button onclick="completetodo('${todo._id}')">mark completed</button></li>
        `).join("")
        console.log(todosList);

        document.getElementById("todo-lists").innerHTML = todosList;
    } catch (error) {
        console.log(error);
    }
}

const deletetodo = async (id) => {
    const token = localStorage.getItem("token");
    try {
        const res = await axios.post("http://localhost:3000/deletetodo", {
            id: id,
        }, {
            headers: {
                token: token
            }
        })
        if (res.data.message) {
            M.toast({
                html: 'todo deleted',
                classes: 'rounded'
            });
            gettodo();
        }
    } catch (error) {
        console.log(error);
    }
}

const completetodo = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.post("http://localhost:3000/completetodo", {
            id: id
        }, {
            headers: {
                token: token
            }
        })
        if (res.data.message) {
            M.toast({
                html: 'todo completed',
                classes: 'rounded'
            });
            gettodo();
        }
    } catch (error) {
        console.log(error);
    }
}

const logout = () =>{
    try {
        localStorage.removeItem("token")
        window.location.href = './signin.html'
    } catch (error) {
        console.log(error);
    }
}

if (localStorage.getItem("token")) {
    document.addEventListener('DOMContentLoaded', () => {
        gettodo();
    })
}