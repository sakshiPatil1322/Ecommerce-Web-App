import React from 'react'

const CategoryForm = ({handleSubmit,value,setValue}) => {
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="form-group d-flex">
                    <input type="text" className="form-control me-4" placeholder='Enter New Category' value={value} onChange={(e) => setValue(e.target.value)} />
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
        </>
    )
}

export default CategoryForm
