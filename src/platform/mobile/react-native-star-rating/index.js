import React from 'react'
import StarRating from 'react-native-star-rating-widget'

const StarRatingWrapper = ({ starSize, rating, valueChanged, disabled, maxStars }) => {
    return (
        <StarRating
            maxStars={parseInt(maxStars)}
            starSize={starSize}
            rating={rating}
            onChange={(value) => {
                if (disabled) return;

                valueChanged(value)
            }}
        />
    )
}

export default StarRatingWrapper