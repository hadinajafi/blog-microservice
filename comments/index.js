const express = require('express');
const bodyParser = require('body-parser');
const {
  randomBytes
} = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const {
    content
  } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({
    id: commentId,
    content,
    status: 'pending'
  });

  commentsByPostId[req.params.id] = comments;
  //sending to event broker
  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: {
      commentId,
      content,
      postId: req.params.id,
      status: 'pending'
    }
  });

  res.status(201).send(comments);
});

app.post('/events', async(req, res) => {
  console.log('Event recieved', req.body.type);

  const {type, data} = req.body;

  if(type === 'CommentModerated'){
    const {id, postId, status, content} = data;
    //find the comments from the post comments
    const comments = commentsByPostId[postId];
    //find the specific comment from the post by id
    const comment = comments.find(comment => {
      return comments.id === id;
    });
    //update comment status from event
    comment.status = status;

    //tell other services that the comment updated
    await axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      data: {
        id,
        postId,
        status,
        content
      }
    })
  }
  res.send({});
})

app.listen(4001, () => {
  console.log('Listening on 4001');
});