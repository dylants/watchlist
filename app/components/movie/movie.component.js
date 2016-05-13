import React, { PropTypes } from 'react';

import style from './movie.component.scss';

export default function Movie(props) {
  function saveMovie() {
    return props.saveMovie(props.id);
  }

  function dismissMovie() {
    return props.dismissMovie(props.id);
  }

  function undismissMovie() {
    return props.undismissMovie(props.id);
  }

  let saveButton;
  if (!props.saved && !props.dismissed) {
    saveButton = <button className={style.button} onClick={saveMovie}>Save</button>;
  }
  let dismissButton;
  if (!props.dismissed) {
    dismissButton = <button className={style.button} onClick={dismissMovie}>Dismiss</button>;
  }
  let undismissButton;
  if (props.dismissed) {
    undismissButton = (
      <button className={style.button} onClick={undismissMovie}>Undo Dismiss</button>
    );
  }

  const buttons = (
    <div className={style.buttons}>
      {saveButton}
      {dismissButton}
      {undismissButton}
    </div>
  );

  const criticIcon = style[props.tomatoIcon];
  const userIcon = props.userScore >= 70 ? style.popcorn : style.spilled;

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
      {buttons}
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
  saved: PropTypes.bool.isRequired,
  dismissed: PropTypes.bool.isRequired,
  saveMovie: PropTypes.func.isRequired,
  dismissMovie: PropTypes.func.isRequired,
  undismissMovie: PropTypes.func.isRequired,
};
