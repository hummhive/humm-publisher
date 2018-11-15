import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col, ListGroup, Badge } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import Moment from 'react-moment';

class Sidebar extends Component {
  render () {
    const { sidebar, match } = this.props
    return (
      <div>
        {sidebar.map((post, index) =>
        <NavLink id={post.hash} to={`/${match.params.page}/${post.hash}`}
        className={`list-group-item list-group-item-action align-items-start`}>
        <h5 class="mb-1">{post.title}</h5><small><Moment format="MMMM D, YYYY [at] h:mm A z">{post.pubdate}</Moment></small>
        <Badge variant="light">{post.status}</Badge>
        </NavLink>
      )}
      </div>
    )
  }
}

function mapStateToProps({posts}){

  const postsObj = Object.keys(posts).map(post => ({
    hash: posts[post].hash,
    title: posts[post].title,
    status: posts[post].status,
    pubdate: posts[post].pubdate,
  }));

  postsObj.sort((a, b) => a.pubdate < b.pubdate);

  return {sidebar: postsObj};
}

export default connect(mapStateToProps)(Sidebar)
