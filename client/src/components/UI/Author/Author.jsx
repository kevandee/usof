import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import cl from './Author.module.css';

const PostAuthor = (props) => {
    const author = props.author;
    console.log("author", props);
    if(!author) {

    }
    const apiURL = process.env.REACT_APP_API_URL + '/api/files/';
    console.log(apiURL + author.profilePicture);
    return(
        <div className={props.className}>
        <div className={cl.post__author}>
            <div className={cl.image__container}>
                <img src={apiURL + author.profilePicture}/>
            </div>
            <div className={cl.author__info}>
                <div className={cl.inner}>
                    <div className={cl.link__container}>
                        <Link to={`/users/${author.id}`}>{author.login}</Link>
                    </div>
                    <div>
                        <span className={cl.rating}>{getRating(author.rating)}</span>
                        <span className={cl.role}>{author.role}</span>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
};

function getRating(ratingCount) {
    return ratingCount > 1000 ? `${(ratingCount / 1000).toFixed(1)}k` : ratingCount;
}

export default PostAuthor;