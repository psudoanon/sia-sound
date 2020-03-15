const musicMetadata = require('music-metadata-browser');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register(SERVICE_WORKER_SCRIPT)
    .then(() => {
      console.log('Service worker registered');
    })
    .catch(err => {
      console.log('Service worker registration failed: ' + err);
    });
}

//TODO: RENAME
function generate_layout(metadata) {
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

    image.id = 'image';
    image.src = `data:image/jpeg;base64,${b64_enc_img}`
    image.height = 200;// (getWidth() / 2);

    body.appendChild(image);
}

function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

const generate_layout_browse_list = async () => {

    const network_hashes     = await fetch('https://471b651a.ngrok.io/hash');
    const hashes             = await network_hashes.json();
    const scrollview         = document.querySelector('.scrollview'),
            elem             = document.getElementById('ru-list-element-template'),
          list_item_template = elem.cloneNode();

   // elem.remove();

    scrollview.innerHTML = '';

    hashes.forEach((hash) => {
        const new_node = list_item_template.cloneNode();
        new_node.innerText = hash;

        new_node.addEventListener('click', () => {
            console.log('clickaroo: ' + hash);
            window.location.href = `${window.location.origin}${window.location.pathname}?song=${hash}`;
        });

        scrollview.appendChild(new_node);
    });
}


(async () => {
    generate_layout_browse_list();

    const button = document.getElementById('upload');
    
    button.addEventListener('click', () => {
        const input = document.createElement('input');
             
        input.type = 'file';
        input.addEventListener('change', function () {
                 for (let file of this.files) {
                     const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = async () => {
                        button.textContent = 'uploading...';
                        const link = await fetch('https://471b651a.ngrok.io/upload', { method: 'POST', body: reader.result});
                        const hash = await link.text();
                        button.textContent = 'Upload a Song!';
                        window.location.href = `${window.location.origin}${window.location.pathname}?song=${hash}`;
                    }
  
                       reader.onerror = (err) => {
                           console.log('filereader error');
                           console.log(err);
                       }
                  }
             });
 
              input.dispatchEvent(new MouseEvent('click'));
          });




/*
    const upload_button = document.getElementById('upload-btn');

    upload_button.addEventListener('click', () => {
        console.log('clciked')
        const input = document.createElement('input');

        input.type = 'file';

        input.addEventListener('change', function () {
            for (let file of this.files) {
                const reader = new FileReader();
                
                reader.readAsDataUURL(file);

                reader.onload = async () => {
                    upload_button.innerText = 'uploading...';
                    const req = await fetch('http://3.18.111.109:9090/upload', { method: 'POST', body: reader.result});
                    const mp3_hash = await req.text();
                /////    generate_layout_browse_list();
                    upload_button.innerText = 'Upload a Song!';
                }

                reader.onerror = (err) => {
                    console.log('error with filereader');
                    console.log(err);
                }

                input.dispatchEvent(new MouseEvent('click'));
            }
        });

    });
*/

    const SIA_UUID_S = window.location.search.substring(window.location.search.indexOf('=') + 1, window.location.search.length);

    if (SIA_UUID_S) {


        const skylink   = `https://siasky.net/${SIA_UUID_S}`;
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

        const loading = document.getElementById('loading');
        
        loading.src = '';
        
        generate_layout(metadata);
    } else {

        
        const title = document.getElementById('title');

        title.textContent = 'Click a recent track or hit upload to get started :)'
        

    }

})();
