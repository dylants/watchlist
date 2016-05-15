import React, { PropTypes, Component } from 'react';

import style from './movie.component.scss';

export default class Movie extends Component {
  state = {
    synopsisContentWrapperClass: style.synopsisContentWrapper,
    synopsisMoreClass: style.synopsisMore,
  };

  saveMovie() {
    return this.props.saveMovie(this.props.id);
  }

  dismissMovie() {
    return this.props.dismissMovie(this.props.id);
  }

  undismissMovie() {
    return this.props.undismissMovie(this.props.id);
  }

  showMore() {
    this.setState({
      synopsisContentWrapperClass: `${this.state.synopsisContentWrapperClass} ` +
        `${style.showMore}`,
      synopsisMoreClass: `${this.state.synopsisMoreClass} ${style.hideMore}`,
    });
  }

  render() {
    let saveButton;
    if (!this.props.saved && !this.props.dismissed) {
      saveButton = (
        <button className={style.button} onClick={::this.saveMovie}>Save</button>
      );
    }

    let dismissButton;
    if (!this.props.dismissed) {
      dismissButton = (
        <button className={style.button} onClick={::this.dismissMovie}>Dismiss</button>
      );
    }

    let undismissButton;
    if (this.props.dismissed) {
      undismissButton = (
        <button className={style.button} onClick={::this.undismissMovie}>Undo Dismiss</button>
      );
    }

    const buttons = (
      <div className={style.buttons}>
        {saveButton}
        {dismissButton}
        {undismissButton}
      </div>
    );

    const criticIcon = style[this.props.tomatoIcon];
    const userIcon = this.props.userScore >= 70 ? style.popcorn : style.spilled;

    return (
      <div className={style.movie}>
        <img className={style.image} src={this.props.image} role="presentation" />
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
        <div className={style.synopsis}>
          <div className={this.state.synopsisContentWrapperClass}>
            <p className={style.synopsisContent}>
              {this.props.synopsis}
            </p>
          </div>
          <div className={this.state.synopsisMoreClass} onClick={::this.showMore}>show more</div>
        </div>
        {buttons}
      </div>
    );
  }
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
  synopsis: PropTypes.string.isRequired,
  saved: PropTypes.bool.isRequired,
  dismissed: PropTypes.bool.isRequired,
  saveMovie: PropTypes.func.isRequired,
  dismissMovie: PropTypes.func.isRequired,
  undismissMovie: PropTypes.func.isRequired,
};
