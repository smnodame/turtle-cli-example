import React from 'react'
import StarRatingComponent from 'react-star-rating-component'

const ReactStarRating = ({ maxStars, rating, disabled, starSize=24, valueChanged }) => {
    return (
        <div style={{ fontSize: starSize }}>
            <StarRatingComponent 
                starCount={maxStars}
                value={rating}
                editing={!disabled}
                onStarClick={valueChanged}
            />
        </div>
    )
}

export default ReactStarRating