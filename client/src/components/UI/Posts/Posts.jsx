import React from 'react';
import Post from '../Post/Post';
import Pagination from '../Pagination/Pagination';

import cl from './Posts.module.css';

const Posts = (props) => {
    const limit = 10;
    
    if (!props.posts.length) {
        return (
            <div>
                <h2>
                    {"There is nothing here :("}
                </h2>
            </div>
        )
    }
    return (
        <div className={cl.posts__container}>
            <div className={cl.inner__container}>
            {props.posts.map((post, index) =>
                <Post number={index + 1} post={post} />
            )}
            </div>
            <Pagination setPage={props.setPage} page={props.page} count={{total: props.total, limit: limit}}></Pagination>
        </div>
    );
}

export default Posts;