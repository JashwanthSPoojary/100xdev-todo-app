const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken');
const app = express();
const bcrypt = require("bcrypt")
const {
    z
} = require('zod')
const {
    userModal,
    todoModal
} = require('./db.js');

app.use(cors());
app.use(express.json());

const JWT_SECRET = "qdfevdferopdkop234433";


const auth = async (req, res, next) => {
    const token = req.headers.token;
    if (token) {
        try {
            const decodedinformation = jwt.verify(token, JWT_SECRET);
            const userId = decodedinformation.userId;
            req.userId = userId;
            next();
        } catch (error) {
            console.log("error is "+error);
        }
    } else {
        res.json({
            error: "user is unauthorized"
        })
        return
    }
}


app.post('/signup', async (req, res) => {
    const validschema = z.object({
        username: z.string().min(2, {
            message: "username should be atleast 2 characters"
        }).max(20, {
            message: "username should be max 20 characters"
        }),
        password: z.string().min(4, {
                message: "password should be atleast 2 characters"
            }).max(16, {
                message: "password should be max 16 characters"
            })
            .regex(/[a-zA-Z]/, "should contain characters")
            .regex(/[0-9]/, "should contain numbers")
            .regex(/[@$!%*?&#]/, "special character please"),
    })
    const parsedschema = validschema.safeParse(req.body);
    if (!parsedschema.success) {
        const error = parsedschema.error;
        res.json({
            error
        })
        return
    }
    const username = req.body.username
    const password = req.body.password
    const hashedpassword = await bcrypt.hash(password, 5);
    try {
        const data = await userModal.create({
            username: username,
            password: hashedpassword
        })
        res.json({
            message: `${data.username}`,
        })
    } catch (e) {
        if (e.code === 11000) {
            console.log(e);
            res.json({
                error: "username already exists",
            })
            return
        }
        res.json({
            error: "not able to process data",
        })
        return
    }
})

app.post('/signin', async (req, res) => {
    const validschema = z.object({
        username: z.string().min(2, {
            message: "username should be atleast 2 characters"
        }).max(20, {
            message: "username should be max 20 characters"
        }),
        password: z.string().min(4, {
                message: "password should be atleast 2 characters"
            }).max(16, {
                message: "password should be max 16 characters"
            })
            .regex(/[a-zA-Z]/, "should contain characters")
            .regex(/[0-9]/, "should contain numbers")
            .regex(/[@$!%*?&#]/, "special character please"),
    })
    const parsedschema = validschema.safeParse(req.body);
    if (!parsedschema.success) {
        const error = parsedschema.error;
        res.json({
            error
        })
        return
    }
    const username = req.body.username
    const password = req.body.password
    try {
        const user = await userModal.findOne({
            username: username
        })
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.json({
                error: "not able to sign in"
            })
            return
        }
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET)
        res.status(200).json({
            message: user.username,
            token
        })
    } catch (error) {
        res.json({
            error: "not able to sign in"
        })
    }

})


app.get('/gettodo', auth, async (req, res) => {
    const userId = req.userId;
    const todos = await todoModal.find({userId:userId});
    res.json({
        todos
    })
});

app.post('/addtodo', auth, async (req, res) => {
    const title = req.body.title;
    const desc = req.body.desc;
    const validschema = z.object({
        title: z.string().min(2, {
            message: "title should be atleast 2 characters"
        }).max(20, {
            message: "title should be max 20 characters"
        }),
        desc: z.string().min(4, {
            message: "description should be atleast 4 charaters"
        }).max(60, {
            message: "password should be max 60 characters"
        })
    })
    const parsedschema = validschema.safeParse({
        title,
        desc
    })
    if (!parsedschema.success) {
        const error = parsedschema.error;
        res.json({
            error
        })
        return
    }
    const userId = req.userId;    
    try {
        await todoModal.create({
            title: title,
            desc: desc,
            userId: userId
        })
        res.status(200).json({
            message: "todo added",
        })
    } catch (err) {
        res.json({
            error:"todo is not added",
            err
        })
    }
})


app.post('/deletetodo', async (req, res) => {
    const id = req.body.id;

    try {
        await todoModal.deleteOne({
            _id: id
        })
        res.json({
            message: "todo deleted"
        })
    } catch (err) {
        res.json({
            error: "todo was not able to be deleted",
            err
        })
    }
})


app.post('/completetodo', async (req, res) => {
    const id = req.body.id;

    try {
        await todoModal.updateOne({
            _id: id
        }, {
            $set: {
                done: true
            }
        })
        res.json({
            message: "todo completed"
        })
    } catch (err) {
        res.json({
            error: "todo was not able to update",
            err
        })
    }
})



app.listen(3000);