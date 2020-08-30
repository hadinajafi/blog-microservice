import React from 'react';

export default ({ comments }) => {
  const renderedComments = comments.map(comment => {
    let content;
    if(comment.status === 'approved'){
      content = comment.content;
    }
    if(comment.status === 'pending'){
      content = 'This comment is awaiting moderating';
    }
    if(comment.status === 'rejected'){
      content = 'This content is rejected';
    }
    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};
