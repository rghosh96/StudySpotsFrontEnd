import React, { useState, useEffect } from 'react';
import Header from '../nav/Header';
import '../../styling/master.scss';
import '../../styling/ratings.scss';
import LoadSpinner from './LoadSpinner';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchSpotDetails } from "../../redux/actions/spotsActions";
import { Tab, Tabs } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faHamburger, faSmileBeam } from '@fortawesome/free-solid-svg-icons'
import Ratings from './Ratings.js'


export default function SpotPage() {
  const [loading, setLoading] = useState(true);
  const [cRating, setCRating] = useState(3)
  const [fRating, setFRating] = useState(5)
  const [aRating, setARating] = useState(4)
  const spot = useSelector(state => state.spots.activeSpot)
    console.log("Hello")
    const dispatch = useDispatch();
    const fetchSpots = () => {
        dispatch(fetchSpotDetails('ChIJa00m55kayYcRnz5WcvjDiMI'));
    }
    // const fetchConstants = () => {
    //     dispatch(fetchSpotsConstants());
    // };
    
  useEffect(() => {
    setTimeout(() => { 
        setLoading(false)
        fetchSpots();
    },1000)
    // dispatch(fetchSpotsConstants());
    
  }, []);

  if (loading) {
    return <LoadSpinner />
  } else {
    return (
        <div>
            <Header />
            {console.log(spot)}
            <div class="container">
                <h1>{spot.name}</h1>
                <p>{spot.formattedAddress}</p>

                <div class = "info">
                    {spot.photos ? <img src={spot.photos[0].url} /> : null }
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
                      <p>pop times will go here</p>
                    </div>
                    
                </div>
                
                <div class="center">
                  <h2>at a glance</h2>
                  <div class = "info">
                    <div class= "infoSection">
                      <p>coffee:</p>
                      <Ratings icon={faCoffee} updateRating={setCRating} currentRating={cRating}/>
                      <p>your rating: unrated</p>
                    </div>
                    <div class= "infoSection">
                      <p>food:</p>
                      <Ratings icon={faHamburger} updateRating={setFRating} currentRating={fRating}/>
                      <p>your rating: unrated</p>
                    </div>
                    <div class= "infoSection">
                    <p>atmosphere:</p>
                    <Ratings icon={faSmileBeam} updateRating={setARating} currentRating={aRating}/>
                    <p>your rating: unrated</p>
                    </div>
                    {console.log("spotpage coffee: " + cRating)}
                    {console.log("spotpage food: " + fRating)}
                    {console.log("spotpage atmosphere: " + aRating)}
                    </div>
                  </div>
                </div>

            <Tabs defaultActiveKey="reviews" id="uncontrolled-tab-example">
                  <Tab eventKey="reviews" title="Reviews">
                    <p>reviews</p>
                  </Tab>
                  <Tab eventKey="features" title="Features">
                  <p>features</p>
                  </Tab>
                  <Tab eventKey="photos" title="Photos">
                  <p>photos</p>
                  { spot.photos && spot.photos.map(photo => {
                        console.log(photo)
                          return (
                            <img class="more-photos" src={photo.url} />
                          )
                      })}
                  </Tab>
                </Tabs>
        </div>
    );
  }
}