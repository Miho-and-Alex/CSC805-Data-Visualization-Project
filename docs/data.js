/*global d3*/

  let groupedByYear = await d3.csv('../data/grouped-by-year.csv', data => ({
    ...data,
    year: +data.year,
    duration_ms: +data.duration_ms,
    explicit: +data.explicit,
    popularity: +data.popularity,
    danceability: +data.danceability,
    energy: +data.energy,
    key: +data.key,
    loudness: +data.loudness,
    mode: +data.mode,
    speechiness: +data.speechiness,
    acousticness: +data.acousticness,
    instrumentalness: +data.instrumentalness,
    liveness: +data.liveness,
    valence: +data.valence,
    tempo: +data.tempo,
  }))

  let groupedByPopularity = await d3.csv('../data/pop_binned_mean_df.csv', data => ({
    ...data,
    year: +data.year,
    duration_ms: +data.duration_ms,
    explicit: +data.explicit,
    popularity: +data.popularity,
    danceability: +data.danceability,
    energy: +data.energy,
    key: +data.key,
    loudness: +data.loudness,
    mode: +data.mode,
    speechiness: +data.speechiness,
    acousticness: +data.acousticness,
    instrumentalness: +data.instrumentalness,
    liveness: +data.liveness,
    valence: +data.valence,
    tempo: +data.tempo,
  }))

export { groupedByYear, groupedByPopularity }