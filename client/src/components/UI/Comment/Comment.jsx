import React, {useEffect, useState} from 'react';
import cl from './Comment.module.css'
import { timeDifference } from '../../../utils/timeDifference';
import Author from '../Author/Author';
import CommentLikes from '../CommentLikes/CommentLikes';
import { Link } from 'react-router-dom';
import CommentInput from '../CommentInput/CommentInput';

const Comment = (props) => {
    const comment = props.comment;
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [comments, setComments] = useState(comment.comments);
    let state = {comments, setComments, setShowCommentInput, comment_id: comment.id};
    const addComment = () => {
        setShowCommentInput(true);
    }
    
    return (
        <div className={props.className ? props.className : ''}>
            <div className={cl.comment}>
                <div className={cl.comment__body}>
                    <span>{comment.content}</span>
                </div>
                <div className={cl.comment__footer}>
                    <div className={cl.author__container}>
                        <Author author={comment.author}></Author>
                    </div>
                    <div className={cl.timestamp}>
                        <span title={new Date(+comment.publishDate).toString()}>{timeDifference(new Date().getTime(), comment.publishDate)}</span>
                    </div>
                    <CommentLikes comment={comment} url={comment.url}/>
                </div>
                <div className={cl.add__comment}>
                    <a onClick={addComment}>Add comment</a>
                </div>
            </div>
            {showCommentInput ? 
            <CommentInput state={state}/>: <div></div>}
            <div className={cl.comment__comments}>
                {comments.map((comment) => {
                    return (
                        <div className={cl.comment__comment}>
                            <hr/>
                            <span>&ndash; {comment.content} &ndash; </span>
                            <Link to={`/user/${comment.author.id}`}>{comment.author.login}</Link>
                            <div className={cl.timestamp} title={new Date(+comment.publishDate).toString()}>
                                <span>{timeDifference(new Date().getTime(), +comment.publishDate)}</span>
                            </div>
                        </div>
                    );
                })
                } 
            </div>
        </div>
    )
}

export default Comment;