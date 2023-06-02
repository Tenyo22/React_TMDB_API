import React from 'react'

const SearchMovie = ( {searchMovie, setSearchKey}) => {
    return (
        <>
            <form className='container mt-4 mb-2 d-flex' onSubmit={searchMovie}>
                <input type='text' className='form-control w-100' placeholder='Search a movie' onChange={(e) => setSearchKey(e.target.value)} />
                <button className='btn btn-primary'>Search</button>
            </form >
        </>
    )
}

export default SearchMovie