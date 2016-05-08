import React, { PropTypes } from 'react';

import style from './movie.component.scss';

export default function Movie(props) {
  const criticIcon = style[props.tomatoIcon];
  const userIcon = props.userScore >= 70 ? style.popcorn : style.spilled;

  function dismissMovie() {
    return props.dismiss(props.id);
  }

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
        <button className={style.button} onClick={dismissMovie}>Dismiss</button>
      </div>
    </div>
  );
}

Movie.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  userScore: PropTypes.number,
  criticScore: PropTypes.number,
  tomatoIcon: PropTypes.string,
  mpaaRating: PropTypes.string.isRequired,
  runtime: PropTypes.string.isRequired,
  dismiss: PropTypes.func.isRequired,
};
