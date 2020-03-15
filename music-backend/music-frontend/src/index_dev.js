const musicMetadata = require('music-metadata-browser');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register(SERVICE_WORKER_SCRIPT, {scope: SW_SCOPE})
    .then(() => {
      console.log('Service worker registered');
    })
    .catch(err => {
      console.log('Service worker registration failed: ' + err);
    });
}

(async () => {
	const skylink   = `https://siasky.net/${SIA_UUID}`;
	const request   = await fetch(skylink);
	const blob 		= await request.blob();
    const reader    = new FileReader();

    reader.readAsDataURL(blob);
    
    reader.onloadend = () => {
        const audio = document.getElementById('song');
        console.log(reader.result); 
        audio.src = reader.result; 
        console.log('set audio src');
    }

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

    title_node.textContent = music_file_info.title + ' - ';
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
