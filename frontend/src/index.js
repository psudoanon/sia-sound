const musicMetadata = require('music-metadata-browser');

(async () => {
    if (!PRODUCTION) {
        console.log('missing uuid try again');
        console.log(TEST_STR);
    } 


	const skylink  = `https://siasky.net/${SIA_UUID}`;

	const request = await fetch(skylink);
	const blob 		= await request.blob();

    // XML HTTP REQUEST APPEND RAW DATA TO SRC

	const metadata = await musicMetadata.parseBlob(blob);

    const music_file_info = {
        title: metadata.common.title,
        artist: metadata.common.artist,
        album: metadata.common.album,
        cover_art: metadata.common.picture[0]
    };

    console.log(music_file_info);

    const title_node = document.getElementById('title');
    const album_node = document.getElementById('album');
    const artist_node = document.getElementById('artist');

    title_node.textContent = music_file_info.title;
    album_node.textContent = music_file_info.album;
    artist_node.textContent = music_file_info.artist;

    const img_data = music_file_info.cover_art.data;
    const b64_enc_img = Buffer.from(img_data).toString('base64');

    const image = document.createElement('img');
    const body = document.getElementById('img-wrapper');

    image.src = `data:image/jpeg;base64,${b64_enc_img}`

    image.id = "image";

    body.appendChild(image);
})();
