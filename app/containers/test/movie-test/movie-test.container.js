import React from 'react';

import Movie from '../../../components/movie/movie.component';

import style from './movie-test.container.scss';

export default function MovieTestContainer() {
  const image = 'http://www.rottentomatoes.com/static/images/redesign/poster_default.gif';
  const synopsis1 = 'Voluptas odit explicabo atque mollitia occaecati sunt. Non ' +
    'esse nostrum doloremque officiis. Dolor voluptatibus fugit cumque soluta.';
  const synopsis2 = 'Nemo est voluptatem non odio voluptatem fugit. Iste ' +
    'architecto placeat in ex voluptatibus sit. Nam maxime aut delectus ' +
    'voluptatibus quia iure ad saepe. Ex voluptates repellat tenetur ut ' +
    'reiciendis harum voluptates distinctio. Rerum voluptatem magni dolorem ' +
    'adipisci dolorem ratione. Ipsa magnam aspernatur rerum est.';
  const synopsis3 = 'Necessitatibus nam quia aut. Nisi quas quis consequatur ' +
    'molestias rerum. Praesentium consequuntur dignissimos asperiores porro ' +
    'eveniet. Aut esse et perspiciatis. Consectetur architecto illo tempore ' +
    'error ipsum. Tempora minima illum quia ut et dolores est.';
  function noop() {}

  return (
    <div className={style.movies}>

      <Movie
        id="1"
        title="Movie Queue Certified Popcorn"
        image={image}
        userScore={80}
        criticScore={90}
        tomatoIcon="certified"
        mpaaRating="PG-13"
        runtime="1 hr. 32 min."
        synopsis={synopsis1}
        saved={false}
        dismissed={false}
        saveMovie={noop}
        dismissMovie={noop}
        undismissMovie={noop}
      />

      <Movie
        id="1"
        title="Movie Queue Fresh Spilled"
        image={image}
        userScore={60}
        criticScore={90}
        tomatoIcon="fresh"
        mpaaRating="R"
        runtime="1 hr. 32 min."
        synopsis={synopsis2}
        saved={false}
        dismissed={false}
        saveMovie={noop}
        dismissMovie={noop}
        undismissMovie={noop}
      />

      <Movie
        id="1"
        title="Movie Queue Rotten Popcorn"
        image={image}
        userScore={60}
        criticScore={50}
        tomatoIcon="rotten"
        mpaaRating="G"
        runtime="2 hr. 3 min."
        synopsis={synopsis3}
        saved={false}
        dismissed={false}
        saveMovie={noop}
        dismissMovie={noop}
        undismissMovie={noop}
      />

      <Movie
        id="1"
        title="Saved Movie"
        image={image}
        userScore={90}
        criticScore={80}
        tomatoIcon="fresh"
        mpaaRating="G"
        runtime="2 hr. 3 min."
        synopsis={synopsis3}
        saved
        dismissed={false}
        saveMovie={noop}
        dismissMovie={noop}
        undismissMovie={noop}
      />

      <Movie
        id="1"
        title="Dismissed Saved Movie"
        image={image}
        userScore={40}
        criticScore={30}
        tomatoIcon="rotten"
        mpaaRating="G"
        runtime="2 hr. 3 min."
        synopsis={synopsis1}
        saved
        dismissed
        saveMovie={noop}
        dismissMovie={noop}
        undismissMovie={noop}
      />

      <Movie
        id="1"
        title="Dismissed Not Saved Movie"
        image={image}
        userScore={40}
        criticScore={30}
        tomatoIcon="rotten"
        mpaaRating="G"
        runtime="2 hr. 3 min."
        synopsis={synopsis2}
        saved={false}
        dismissed
        saveMovie={noop}
        dismissMovie={noop}
        undismissMovie={noop}
      />

    </div>
  );
}
