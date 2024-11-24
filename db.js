const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

mongoose.connect("mongodb+srv://jaswanthspoojary:738Tky7fx2u6HWlS@jashwanth-cluster.ztjvr.mongodb.net/todos")
    .then(() => {
        console.log("db connection successfully")
    }).catch((error) => {
        console.log("errors is " + error.message);
    });

const user = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const todo = new Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        required: true
    },
    done: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const userModal = mongoose.model("user", user);
const todoModal = mongoose.model("todos", todo);

module.exports = {
    userModal,
    todoModal
}