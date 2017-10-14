import axios from 'axios'
import { $ } from './bling'

const tracklistSearch = {

}

function loadAlbum(record.artist, record.title, API_KEY = process.env.API_KEY) {
 	const url = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${process.env.API_KEY}&artist=${record.artist}&album=${record.title}&format=json`
	axios
		.get(url)
		.then(res => {
			const album = res.data.album;
			console.log(album);
		})
		.catch(console.error);
}

function makeTracklist() {
	loadAlbum();
}

export default makeTracklist;