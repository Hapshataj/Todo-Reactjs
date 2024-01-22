const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const persist = require('node-persist');
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
persist.init({ dir: './persist-data' })
    .then(async () => {
        const tasks = (await persist.getItem('tasks')) || [];

        app.get('/tasks', (req, res) => {
            res.json(tasks);
        });

        app.post('/tasks', async (req, res) => {
            const { task } = req.body;
            tasks.push(task);
            await persist.setItem('tasks', tasks);

            res.status(201).json(task);
        });

        app.delete('/tasks/:index', async (req, res) => {
            const { index } = req.params;

            tasks.splice(index, 1);
            await persist.setItem('tasks', tasks);

            res.sendStatus(204);
        });

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error initializing node-persist:', error);
    });
