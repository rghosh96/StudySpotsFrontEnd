import React, { useState, useEffect } from 'react';
import '../../styling/master.scss';
import '../../styling/ratings.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// props are: desired icon, updating rating in spot page, and current rating from spot page
const Ratings = ({icon, updateRating, currentRating, itemType, signedIn}) => {
    // for hover effects when user hovers over to rate
    const [hover, setHover] = useState(null)

    /* process: map over 5 items (for out of 5 rating)
    ** render input, which is hidden via the scss styling to render
    ** and update ratings. render FontAwesomeIcon with desired 
    ** icon passed in from props in order to display rating icons
    ** when user clicks on rating, spot page state is updated via
    ** the updateRating prop passed into component
    */
   const signedInView = [ ...Array(5)].map((item, i) => {
                const ratingValue = i +1;
                return <label>
                <input type="radio" 
                    name="rate" 
                    value={ratingValue} 
                    onClick={()=>updateRating(itemType, ratingValue)}
                    />
                <FontAwesomeIcon className="star" 
                    color={ratingValue <= (hover || currentRating) ? "#c29257" : "#7f7f7f"}
                    icon={icon} 
                    size='2x'
                    onMouseEnter={()=>setHover(ratingValue)}
                    onMouseLeave={()=>setHover(null)}
                    />
                </label>
            })
    const notSignedInView = [ ...Array(5)].map((item, i) => {
        const ratingValue = i +1;
        return <label>
        <FontAwesomeIcon className="star-no-hover" 
            color={ratingValue <= currentRating ? "#c29257" : "#7f7f7f"}
            icon={icon} 
            size='2x'
            />
        </label>
    })
    return(
        
        <div class="ratings">
            {signedIn ? signedInView : notSignedInView}
        </div>
    )
}

export default Ratings