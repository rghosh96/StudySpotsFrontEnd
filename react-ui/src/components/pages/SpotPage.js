import React, { useState, useEffect } from 'react';
import Header from '../nav/Header';
import '../../styling/master.scss';
import '../../styling/ratings.scss';
import LoadSpinner from './LoadSpinner';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchSpotDetails } from "../../redux/actions/spotsActions";
import { Tab, Tabs } from 'react-bootstrap'
import { faStore, faHamburger, faSmileBeam, faMusic, faAdjust } from '@fortawesome/free-solid-svg-icons'
import Ratings from './Ratings.js'
import PopTimesChart from "./PopTimesChart"


export default function SpotPage() {
  const [mRating, setMRating] = useState(3)
  const [sRating, setSRating] = useState(4)
  const [lRating, setLRating] = useState(2)
  const [fRating, setFRating] = useState(1)
  const [oRating, setORating] = useState(4)
  const spot = useSelector(state => state.spots.activeSpot)
    console.log("Hello")
    const dispatch = useDispatch();
    const fetchSpots = () => {
        dispatch(fetchSpotDetails('ChIJa00m55kayYcRnz5WcvjDiMI'));
    }
    var popTimesToday = null;
    if (spot.popularTimes) {
      let date = new Date();
      let day = date.getDay();
      popTimesToday= spot.popularTimes.week[day]
    }
    
  useEffect(() => {
    setTimeout(() => { 
        fetchSpots();
    },1000)
    
  }, []);

  // changed to render page when popular times loads, since it takes the longest
  if (!spot.popularTimes) {
    return <LoadSpinner />
  } else {
    return (
        <div>
            <Header />
            {console.log("THIS IS SPOT INFO")}
            {console.log(spot)}
            <div class="container">
                <h1>{spot.name}</h1>
                <p>{spot.formattedAddress}</p>
                <div class = "info">
                    {spot.photos ? <img class="main-image" src={spot.photos[0].url} /> : null }
                    <div class= "infoSection">
                      <h2>hours</h2>
                      { spot.openHours && spot.openHours.map(hour => {
                        console.log(hour)
                          return (
                              <p>{hour}</p>
                          )
                      })}
                    </div>
                    <div class= "infoSection">
                      <h2>popular times</h2>
                      <p>currently:</p>
                     {spot.popularTimes ? <PopTimesChart day={popTimesToday.day} hours={popTimesToday.hours} />
                     : null}
                    </div>
                </div>
                
                <div class="center">
                  <h2>at a glance</h2>
                  <div class = "info">
                    <div class= "infoSection">
                      <p>music:</p>
                      <Ratings icon={faMusic} updateRating={setMRating} currentRating={mRating}/>
                      <p>your rating: unrated</p>
                    </div>
                    <div class= "infoSection">
                      <p>space:</p>
                      <Ratings icon={faStore} updateRating={setSRating} currentRating={sRating}/>
                      <p>your rating: unrated</p>
                    </div>
                    <div class= "infoSection">
                      <p>lighting:</p>
                      <Ratings icon={faAdjust} updateRating={setLRating} currentRating={lRating}/>
                      <p>your rating: unrated</p>
                    </div>
                    <div class= "infoSection">
                      <p>food:</p>
                      <Ratings icon={faHamburger} updateRating={setFRating} currentRating={fRating}/>
                      <p>your rating: unrated</p>
                    </div>
                    <div class= "infoSection">
                      <p>overall:</p>
                      <Ratings icon={faSmileBeam} updateRating={setORating} currentRating={oRating}/>
                      <p>your rating: unrated</p>
                    </div>
                    
                    {console.log("spotpage music: " + mRating)}
                    {console.log("spotpage space: " + sRating)}
                    {console.log("spotpage lighting: " + lRating)}
                    {console.log("spotpage food: " + fRating)}
                    {console.log("spotpage overall: " + oRating)}
                  </div>
                </div>
              </div>

            <Tabs defaultActiveKey="reviews" id="uncontrolled-tab-example">
                  <Tab eventKey="reviews" title="Google Reviews">
                    { spot.reviews && spot.reviews.map(review => {
                        console.log(review)
                          return (
                            <div>
                              <h3>{review.author}</h3>
                              <p>{review.text}</p>
                              <p>rating: {review.rating}</p>
                              <hr/>
                            </div>
                            
                          )
                      })}
                  </Tab>
                  <Tab eventKey="comments" title="Comments">
                  <p>comments</p>
                  </Tab>
                  <Tab eventKey="photos" title="More Photos">
                  <div class="photo-wrap"> 
                  { spot.photos && spot.photos.map(photo => {
                        console.log(photo)
                          return (
                            <img class="more-photos" src={photo.url} />
                          )
                      })}
                      </div>
                  </Tab>
                </Tabs>
        </div>
    );
  }
} 