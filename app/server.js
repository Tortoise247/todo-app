const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose'); // Mongooseを追加
require('dotenv').config(); // 環境変数を読み込む

const app = express();
const PORT = 3000;

// MongoDBに接続
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const cluster = process.env.MONGODB_CLUSTER;
const dbname = process.env.MONGODB_DBNAME;

// const uri = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`;
const uri =`mongodb://localhost:27017/${dbname}`;

// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect(uri)
    .then(() => {
        console.log('MongoDBに接続しました');
    })
    .catch((error) => {
        console.error('MongoDBの接続に失敗しました:', error);
    });

// JSONボディを解析するためのミドルウェア
app.use(bodyParser.json());

// 静的ファイルを提供
app.use(express.static(path.join(__dirname)));

// TODOタスクのスキーマとモデルを定義
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', todoSchema);

// TODOタスクを取得
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// TODOタスクの作成
app.post('/todos', async (req, res) => {
    const newTodo = new Todo({
        title: req.body.title,
        completed: req.body.completed || false
    });

    try {
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// TODOタスクの更新
app.put('/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'タスクが見つかりません' });
        }

        todo.title = req.body.title || todo.title;
        todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;

        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`サーバーがポート${PORT}で起動しました`);
});