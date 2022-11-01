import React from "react";
import cl from './Pagination.module.css'

const Pagination = ({count, page, setPage}) => {
    const nums = []
    for (let i = 1; i <= count.total/count.limit + 1; i++) {
        nums.push(i);
    }

    return (
        <div className={cl.page__wrapper}>
            {nums.map(p =>
                <span onClick={() => setPage(p)} className={page === p ? `${cl.page} ${cl.page__current}` : cl.page}>
                    {p}
                </span>
            )}
        </div>
    )
}

export default Pagination;
