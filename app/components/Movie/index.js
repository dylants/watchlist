import React, { Component, PropTypes } from 'react';

import style from './style.scss';

export default class Movie extends Component {
  render() {
    const criticIcon = style[this.props.tomatoIcon];
    const userIcon = (this.props.userScore >= 70) ? style.popcorn : style.spilled;

    return (
      <div className={style.movie}>
        <img className={style.image} src={this.props.image} />
        <div className={style.title}>{this.props.title}</div>
        <div className={style.scores}>
          <i className={criticIcon}></i>
          <span className={style.score}>{this.props.criticScore}</span>
          <i className={userIcon}></i>
          <span className={style.score}>{this.props.userScore}</span>
        </div>
        <div className={style.attributes}>
          <span className={style.attribute}>{this.props.runtime}</span>
          <span className={style.attribute}>{this.props.mpaaRating}</span>
        </div>
        <div className={style.buttons}>
          <button className={style.button}>Save</button>
          <button className={style.button}>Dismiss</button>
        </div>
      </div>
    );
  }
}

Movie.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  userScore: PropTypes.number,
  criticScore: PropTypes.number,
  tomatoIcon: PropTypes.string,
  mpaaRating: PropTypes.string.isRequired,
  runtime: PropTypes.string.isRequired,
};
