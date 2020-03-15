const express = require('express');
const cors	  = require('cors');
const parser  = require('body-parser');
const SkyNet  = require('@nebulous/skynet');
const fs 			= require('fs');
const child_process = require('child_process');

/**
*/

(async () => {
	const app  = express();
	const PORT = 9090;
	const HASHES = [];

	app.use(cors());
	app.use(parser.raw({ type: '*/*', limit: '21mb'}));

	app.get('/hash', async (request, response, next) => {

		response.send(JSON.stringify(HASHES));

	});

	app.post('/upload', async (request, response, next) => {


						if (!request.body) {
							console.log('bad request');
							return;
						}

						const base64data 	= request.body.toString();
						const file 				= base64data.substring(22, base64data.length);
						const buffer 			= Buffer.from(file, 'base64');
						const tmp_filename = file.substring(0, 21) + '.mp3';
						const tmp_path 		= `/tmp/${tmp_filename}`

						await fs.writeFile(tmp_path, buffer, (err, ) => {});

						const mp3_skylink 			= await SkyNet.UploadFile(tmp_path, SkyNet.DefaultUploadOptions);
						const mp3_skylink_hash 	= mp3_skylink.substring(mp3_skylink.indexOf(':') + 3, mp3_skylink.lenth);

						console.log('mp3 hash: ' + mp3_skylink_hash);

						HASHES.push(mp3_skylink_hash);

						response.send(mp3_skylink_hash);

/*
						const service_worker_generation = child_process.spawn('npx', ['webpack', 
																																					`--env.uuid=${mp3_skylink_hash}`, 
																																					'--config', 
																																					'webpack_service_worker.config.js'], { cwd : __dirname + '/music-frontend' });

						service_worker_generation.on('close', async (status_code) => {
							const output_file_path = __dirname + '/music-frontend/dist/service_worker.js';
							const sw_skylink			 = await SkyNet.UploadFile(output_file_path, SkyNet.DefaultUploadOptions);
							const sw_skylink_hash  = sw_skylink.substring(sw_skylink.indexOf(':') + 3, sw_skylink.length)

							console.log('service worker hash');
							console.log(sw_skylink_hash);
							
							const html_build_process = child_process.spawn(`npx`,  [	'webpack', 
																																				`--env.uuid=${mp3_skylink_hash}`,
																																				`--env.serviceworkerhash=${sw_skylink_hash}` ,
																																				'--config', 
																																				'webpack.config.js' ], { cwd : __dirname + '/music-frontend'})

										html_build_process.on('close', async (code) => {
													const html_skylink 			= await SkyNet.UploadFile(__dirname + '/music-frontend/dist/index.html', SkyNet.DefaultUploadOptions);
													const html_skylink_hash = html_skylink.substring(html_skylink.indexOf(':') + 3, html_skylink.length);
													console.log('html hash');
													console.log(html_skylink_hash);
													response.send(html_skylink_hash);
										});
						});
				 } catch (e) {
						console.log(e)
				 }
		

*/
		// use upload UUID to run webpack
		// upload index.html to skynet
		// return URL to frontend
	});

	app.listen(PORT, () => {
		console.log('app listening');
	});

})();
