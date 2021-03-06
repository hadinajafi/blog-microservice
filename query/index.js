const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const {type, data} = req.body;

    if(type === 'PostCreated'){
        const {id, title} = data;
        posts[id] = {id, title, comments: []};
    }
    if(type === 'CommentCreated'){
        const {id, content, postId, status} = data;
        const post = posts[postId];
        post.comments.push({id, content, status});
    }
    if(type === 'CommentUpdated'){
        const {content, postId, status, id} = data;

        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return id === comment.id;
        });
        //update comment status & content
        comment.status = status;
        comment.content = content;
    }

    res.send({});
});

app.listen(4002, () => {
    console.log('Listenting on port 4002');
});
