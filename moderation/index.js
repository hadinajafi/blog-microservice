const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async(req, res) => {
  const {type, data} = req.body;
  const {id, content, postId} = data;
  if(type === 'CommentCreated'){
    const status = content.includes('orange') ? 'rejected' : 'approved';

    await axios.post('http://localhost:4005/events', {
      type: 'CommentModerated',
      data: {
        id,
        postId,
        content,
        status
      }
    });

    res.send({});
  }
});

app.listen(4003, () => {
  console.log("Running on port 4003");
})