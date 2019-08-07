let takeAverage = require("./takeAverage");
let titleCheck = require("./titleCheck");

const getAlbums = (spotify, albums) => {
  let allAlbums = albums.map(album => {
    return spotify
      .search({ type: "album", query: album.title })
      .then(data => {
        // console.log(data.albums.items[0]);
        let titleMatchIndex = -1;
        if (data && data.albums && data.albums.items.length > 0) {
          const { albums } = data;
          titleMatchIndex = albums.items.findIndex(soundTrack => {

            const albumDate = album.year || album.release_date;
            const soundTrackDate =
              soundTrack.release_date.length > 4
                ? soundTrack.release_date.slice(0, 4)
                : soundTrack.release_date;
              //   console.log(
              //   album.release_date === soundTrack.release_date,
              //   album.release_date,
              //   album.year,
              //   soundTrack.release_date,
              //   albumDate === soundTrackDate,
              //   soundTrack.name.trim().toLowerCase() === album.title,
              //   album.title,
              //   soundTrack.name
              // );
            return (
              (soundTrack.name.trim().toLowerCase() === album.title ||
              titleCheck(soundTrack.name
                .trim()
                .toLowerCase(), album.title) && albumDate === soundTrackDate
            ))
          });
          console.log(titleMatchIndex, "#########################################", albums.items[titleMatchIndex])
          if (titleMatchIndex !== -1) {
            // console.log(
            //   albums.items[titleMatchIndex].id,
            //   "))))))))))))))))))))))))))))))))))))))))))))"
            // );
            return spotify.request(
              `https://api.spotify.com/v1/albums/${
                albums.items[titleMatchIndex].id
              }/tracks`
            );
          } else {
            return null;
          }
        } else {
          return null;
        }
      })
      .then(data => {
        // console.log(data, "^^^^^^^^^^^^^^^^^^^^^^^")
        if (data) {
          let trackIds = data.items.map(track => track.id).join(",");
          return spotify.request(
            `https://api.spotify.com/v1/audio-features/?ids=${trackIds}`
          );
        } else {
          return null;
        }
      })
      .then(data => {
        if (data) {
          const result = takeAverage(data.audio_features);
          return { result, title: album.title };
        } else {
          return [];
        }
        // console.log(result, "$$$$$$$$$$")
      });
  });
  return Promise.all(allAlbums);
};

module.exports = getAlbums;
