import React from 'react';
import cl from './Category.module.css'

const Category = (props) => {
    return (
        <div title={props.category.description} className={cl.category__container}>
            <span>{props.category.title}</span>
        </div>
    )
}

export default Category;