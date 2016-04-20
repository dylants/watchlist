import React, { PropTypes } from 'react';

import style from './style.scss';

export default function Movie(props) {
  const criticIcon = style[props.tomatoIcon];
  const userIcon = (props.userScore >= 70) ? style.popcorn : style.spilled;

  return (
    <div className={style.movie}>
      <img className={style.image} src={props.image} role="presentation" />
      <div className={style.title}>{props.title}</div>
      <div className={style.scores}>
        <i className={criticIcon}></i>
        <span className={style.score}>{props.criticScore}</span>
        <i className={userIcon}></i>
        <span className={style.score}>{props.userScore}</span>
      </div>
      <div className={style.attributes}>
        <span className={style.attribute}>{props.runtime}</span>
        <span className={style.attribute}>{props.mpaaRating}</span>
      </div>
      <div className={style.buttons}>
        <button className={style.button}>Save</button>
        <button className={style.button}>Dismiss</button>
      </div>
    </div>
  );
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
