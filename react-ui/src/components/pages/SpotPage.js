import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../nav/Header';
import '../../styling/master.scss';
import '../../styling/ratings.scss';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import LoadSpinner from './LoadSpinner';
import { useSelector, useDispatch } from "react-redux";
import { fetchSpotDetails, submitRating, fetchComments, createComment, deleteComment, updateComment } from "../../redux/actions/spotsActions";
import { Tab, Tabs } from 'react-bootstrap'
import { faStore, faHamburger, faSmileBeam, faMusic, faAdjust } from '@fortawesome/free-solid-svg-icons'
import Ratings from './Ratings.js'
import PopTimesChart from "./PopTimesChart"
import { getUserId } from '../../services/firebaseService'


export default function SpotPage() {

  const [ratings, setRatings] = useState({
    overall: null,
    music: null,
    lighting: null,
    space: null,
    food: null
  })

  const [comment, setComment] = useState('')
  const [modalToggle, setModalToggle] = useState(false)
  const [commentId, setCommentId] = useState()
  const [firebaseUID, setFirebaseUID] = useState()

  const updateState = (attribute, data) => {
    setRatings({
      ...ratings,
      [attribute]: data
    })
  }

  const handleSubmit = () => {
    console.log("in handle submit")
    console.log(activeSpot.placeId)
    console.log(comment)
    dispatch(createComment(activeSpot.placeId, comment))
    dispatch(fetchComments(activeSpot.placeId))
  }

  const removeComment = (index) => {
    console.log("deleting comment ...")
    console.log(activeSpot.placeId)
    console.log(index)
    dispatch(deleteComment(params.placeId, index))
    dispatch(fetchComments(activeSpot.placeId))
  }

  const update = () => {
    console.log("updating comment ...")
    console.log(commentId)
    console.log(comment)
    dispatch(updateComment(params.placeId, commentId, comment))
    dispatch(fetchComments(activeSpot.placeId))
    setModalToggle(false)
  }

  const handleChange = (e) => {
    setComment(e.target.value)
    console.log(comment)
  }

  const prepareModal = (comment, id) => {
    setComment(comment)
    setCommentId(id)
    setModalToggle(true)
  }

  const { activeSpot, fetchingSpots, comments, creatingComment, fetchingComments } = useSelector(state => state.spots)
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
    getUserId()
        .then(userId => {
            setFirebaseUID(userId)
        })
        .catch(error => {
            console.log("error in fetching firebase user id :/")
        });
  }, [activeSpot]);

  useEffect(() => {
    if (activeSpot && activeSpot.popularTimes.status === "ok") {
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
      {fetchingSpots || !activeSpot ?
        <LoadSpinner />
        :
        <div>
          <div class="container">
            <h1>{activeSpot.name}</h1>
            <p>{activeSpot.formattedAddress}</p>
            {console.log(isSignedIn)}
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
                </div>
                <div class="infoSection">
                  <p>space:</p>
                  <Ratings icon={faStore} updateRating={updateState} currentRating={ratings.space} itemType="space" signedIn={isSignedIn}  />
                </div>
                <div class="infoSection">
                  <p>lighting:</p>
                  <Ratings icon={faAdjust} updateRating={updateState} currentRating={ratings.lighting} itemType="lighting" signedIn={isSignedIn}  />
                </div>
                <div class="infoSection">
                  <p>food:</p>
                  <Ratings icon={faHamburger} updateRating={updateState} currentRating={ratings.food} itemType="food" signedIn={isSignedIn}  />
                </div>
                <div class="infoSection">
                  <p>overall:</p>
                  <Ratings icon={faSmileBeam} updateRating={updateState} currentRating={ratings.overall} itemType="overall" signedIn={isSignedIn}  />
                </div>
              </div>
              {isSignedIn ? <Button onClick={() => dispatch(submitRating(activeSpot.placeId, ratings))}>submit</Button> : null}
              
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
            <Tab eventKey="comments" title="User Comments">
              {isSignedIn ? <div>
                <h2>add your comment!</h2>
                <Form >
                    <Form.Group >
                    <Form.Control required as="textarea" rows={3} onChange={(e) => handleChange(e)} />
                    </Form.Group>
                    <Button onClick={() => handleSubmit()}>Submit Comment!</Button>
                </Form>
              <hr />
              </div> : null }
              
              <h2>all comments</h2>
              <br />
              {console.log("COMMENTS ARRAY")}
              {console.log(comments)}
              {console.log(firebaseUID)}
              {comments && comments.map(comment => {
                return (
                  <div>
                    <h3>{comment.fname} {comment.lname}</h3>
                    <p>{comment.comment}</p>
                    {comment.userId === firebaseUID ? 
                    <div>
                      <Button onClick={() => removeComment(comment.commentId)}>delete comment</Button>
                      <Button onClick={() => prepareModal(comment.comment, comment.commentId)}>update comment</Button>
                    </div> 
                    : null}
                    <hr />
                  </div>
                )
              })}
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


          <Modal 
            show={modalToggle} 
            onHide={() => setModalToggle(false)}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header>
                <Modal.Title>update your comment: </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div class="center">
            <Form >
                <Form.Group >
                <Form.Control required as="textarea" defaultValue={comment} rows={3} onChange={(e) => handleChange(e)} />
                </Form.Group>
              </Form>
              </div>
              </Modal.Body>
            <Modal.Footer>
            <Button onClick={() => update()}>Submit Comment!</Button>
            <Button variant="secondary" onClick={() => setModalToggle(false)}>
                Cancel
            </Button>
            </Modal.Footer>
            </Modal>

        </div>
      } 
    </div>
  );

}