import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../nav/Header';
import '../../styling/master.scss';
import '../../styling/ratings.scss';
import Button from 'react-bootstrap/Button';
import LoadSpinner from './LoadSpinner';
import { useSelector, useDispatch } from "react-redux";
import { fetchSpotDetails, submitRating, fetchComments } from "../../redux/actions/spotsActions";
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

  const [ratings, setRatings] = useState({
    overall: null,
    music: null,
    lighting: null,
    space: null,
    food: null
  })

  const updateState = (attribute, data) => {
    setRatings({
      ...ratings,
      [attribute]: data
    })
  }

  const { activeSpot, fetchingSpots, commentDetails, fetchingComments, commentsFetched } = useSelector(state => state.spots)
  const { isSignedIn } = useSelector(state => state.account)
  const [popTimesToday, setPopTimesToday] = useState("unavailable")
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!fetchingSpots && (!activeSpot || activeSpot.placeId != params.placeId)) {
      dispatch(fetchSpotDetails(params.placeId));
      dispatch(fetchComments(params.placeId));
    }
  });

  useEffect(() => {
    if (activeSpot && activeSpot.popularTimes.status === "ok") {
      console.log("setting pop times")
      const date = new Date();
      const day = date.getDay();
      setPopTimesToday(<PopTimesChart day={activeSpot.popularTimes.week[day].day} hours={activeSpot.popularTimes.week[day].hours} />)
      setRatings({
        overall: activeSpot.studySpotsRatings.overall,
        music: activeSpot.studySpotsRatings.music,
        lighting: activeSpot.studySpotsRatings.lighting,
        space: activeSpot.studySpotsRatings.space,
        food: activeSpot.studySpotsRatings.food
      })
    }
  }, [activeSpot]);

  // changed to render page when popular times loads, since it takes the longest

  return (
    <div>
      <Header />
      {console.log("active spot")}
      {console.log(activeSpot)}
      {console.log("fetching spots")}
      {console.log(fetchingSpots)}
      {console.log("signed in ?" + isSignedIn)}
      {fetchingSpots || !activeSpot ?
        <LoadSpinner />
        :
        <div>
          <div class="container">
            <h1>{activeSpot.name}</h1>
            <p>{activeSpot.formattedAddress}</p>
            <div class="info">
              {activeSpot.photos ? <img class="main-image" src={activeSpot.photos[0].url} /> : null}
              <div class="infoSection">
                <h2>hours</h2>
                {activeSpot.openHours ? 
                  activeSpot.openHours.map(hour => {
                      return (
                        <p>{hour}</p>
                      )
                    })
                  : "unavailable"}
              </div>
              <div class="infoSection">
                <h2>popular times</h2>
                <p>currently:</p>
                {popTimesToday}
              </div>
            </div>

            <div class="center">
              <h2>at a glance</h2>
              <div class="info">
                <div class="infoSection">
                  <p>music:</p>
                  <Ratings icon={faMusic} updateRating={updateState} currentRating={ratings.music} itemType="music" signedIn={isSignedIn} />
                  <p>your rating: unrated</p>
                </div>
                <div class="infoSection">
                  <p>space:</p>
                  <Ratings icon={faStore} updateRating={updateState} currentRating={ratings.space} itemType="space" signedIn={isSignedIn}  />
                  <p>your rating: unrated</p>
                </div>
                <div class="infoSection">
                  <p>lighting:</p>
                  <Ratings icon={faAdjust} updateRating={updateState} currentRating={ratings.lighting} itemType="lighting" signedIn={isSignedIn}  />
                  <p>your rating: unrated</p>
                </div>
                <div class="infoSection">
                  <p>food:</p>
                  <Ratings icon={faHamburger} updateRating={updateState} currentRating={ratings.food} itemType="food" signedIn={isSignedIn}  />
                  <p>your rating: unrated</p>
                </div>
                <div class="infoSection">
                  <p>overall:</p>
                  <Ratings icon={faSmileBeam} updateRating={updateState} currentRating={ratings.overall} itemType="overall" signedIn={isSignedIn}  />
                  <p>your rating: unrated</p>
                </div>
                {console.log("ratings")}
                {console.log(ratings)}
              </div>
              <Button onClick={() => dispatch(submitRating(activeSpot.placeId, ratings))}>submit</Button>
            </div>
          </div>

          <Tabs defaultActiveKey="reviews" id="uncontrolled-tab-example">
            <Tab eventKey="reviews" title="Google Reviews">
              {activeSpot.reviews && activeSpot.reviews.map(review => {
                return (
                  <div>
                    <h3>{review.author}</h3>
                    <p>{review.text}</p>
                    <p>rating: {review.rating}</p>
                    <hr />
                  </div>
                )
              })}
            </Tab>
            <Tab eventKey="comments" title="Comments">
              <p>comments</p>
            </Tab>
            <Tab eventKey="photos" title="More Photos">
              <div class="photo-wrap">
                {activeSpot.photos && activeSpot.photos.map(photo => {
                  return (
                    <img class="more-photos" src={photo.url} />
                  )
                })}
              </div>
            </Tab>
          </Tabs>
        </div>
      }
    </div>
  );

}