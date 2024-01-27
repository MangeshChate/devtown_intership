const express = require("express");
const mongoose = require("mongoose")
const app = express();
const Users = require("./modal/User");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { ScanCommand, PutCommand, DeleteCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const DocumentClient = require('./dynamodbClient');
const cuid = require('cuid');
const TableName = "task_management_table";

app.use(cors());

app.use(express.json());


//MONGO DB connection
MONGO_URL = "mongodb+srv://mangesh:QYTLPQdNOFoTwxuz@cluster0.6hhshhc.mongodb.net/DevTownAuth?retryWrites=true&w=majority"
async function connectToMongoDB() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectToMongoDB();

let refreshtokens = [];

app.post("/api/refresh", (req, res) => {
    let refreshToken = req.body.token;
        
        if (!refreshToken) return res.status(401).json("you are not authenticated ");
        if (!refreshtokens.includes(refreshToken)) {
            return res.status(403).json("refresh token is not valid ");
        }
   

    jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
        err && console.log(err);
        refreshtokens = refreshtokens.filter(token => token !== refreshToken);

        const newAccessToken = genrateAccessToken(user);
        const newRefreshToken = genrateRefreshToken(user);

        refreshtokens.push(newRefreshToken);

        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })
    })
})

//Register User
app.post("/api/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const newUser = new Users({
            username: username,
            password: password
        });

        await newUser.save();
        res.status(200).json("Registration Successful !");

    } catch (error) {
        console.log(error);
        res.status(400).json("something went wrong ! Registration Failed !");
    }


});


//Genrating Tokens
const genrateAccessToken = (user) => {
    return jwt.sign({ id: user._id }, "mySecretKey", { expiresIn: "5d" })
}
const genrateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, "myRefreshSecretKey");
}


//Login User
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await Users.findOne({ username, password });

    if (user) {
        //genrating access token
        const accessToken = genrateAccessToken(user);
        const refreshToken = genrateRefreshToken(user);
        res.json({
            username: user.username,
            userId:user._id,
            accessToken,
            refreshToken
        })
    }
});

//verify user 
const verify = (req, res, next) => {
    const authHeaders = req.headers.authorization;
    if (authHeaders) {
        const token = authHeaders.split(" ")[0];
        jwt.verify(token, "mySecretKey", (err, user) => {
            if (err) {
                return res.status(403).json("Json token is not valid ");
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json("we are not authenticate");
    }
}


//logout
app.post("/api/logout", verify, (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) {
        return res.status(400).json("Invalid and missing refreshToken in the request body ");
    }

    refreshtokens = refreshtokens.filter((token) => token !== refreshToken);
    res.status(200).json("Logout successful");
});



//DynomoDb Task Management

app.post("/api/task/getTasks", async (req, res) => {
    const { userId } = req.body;

    async function getAllTasks() {
        try {
            const response = await DocumentClient.send(new ScanCommand({
                TableName: TableName
            }));

            let tasks = response.Items;
            
            
            tasks = tasks.filter(item => item.userID === userId);

            res.json(tasks);
        } catch (error) {
            console.error('Error getting tasks:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    getAllTasks();
});

app.post("/api/task/addTask",(req,res)=>{
    const {userId , title , description , dueDate} = req.body ;
    async function addTask(task){
        await DocumentClient.send(new PutCommand({
            TableName: TableName,
            Item: task
        }));
        res.status(200).json("Sucessfully Task Added");
    }
    const task = {
        taskId: cuid(),
        userID:userId,
        title: title,
        description: description,
        dueDate:dueDate
    }
    addTask(task);


});

app.post("/api/task/deleteTask",(req,res)=>{
    const {taskId} = req.body;

    async function deleteTask(id){
     await DocumentClient.send(new DeleteCommand({
            TableName: TableName,
            Key: {
                taskId
            }
        }));
        res.status(200).json("Task Deleted Successfully !");
    }

    deleteTask(taskId)
    
});


app.post("/api/task/update", async (req, res) => {
    const { taskId, title, description, dueDate } = req.body;

    async function updateTask(task) {
        const id = task.id;
        try {
            
            const updateResponse = await DocumentClient.send(new UpdateCommand({
                TableName: TableName,
                Key: {
                    taskId: id
                },
                UpdateExpression: "set #description = :s, #dueDate = :d ,#title = :t",
                ExpressionAttributeNames: {
                    "#description": "description",
                    "#dueDate": "dueDate",
                    "#title": "title",
                },
                ExpressionAttributeValues: {
                    ":s": task.description,
                    ":d": task.dueDate,
                    ":t": task.title,
                },
                ReturnValues: "ALL_NEW"
            }));

            res.status(200).json("Task Updated Successfully !");
        } catch (error) {
            res.status(400).json(error);
        }
    }

    const updatedTask = {
        id: taskId,
        title: title,
        description: description,
        dueDate: dueDate
    };

    // Call the updateTask function
    updateTask(updatedTask);
});






















app.listen(5500, () => {
    console.log("server connected at port 5500");
})