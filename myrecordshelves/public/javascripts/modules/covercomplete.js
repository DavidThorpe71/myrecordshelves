function covercomplete(artist, title) {
	if(!artist || !title) return; //skip function if no input on page
	const lastfmURL = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${process.env.API_KEY}&artist=${artist.value}&album=${title.value}&format=json`
	console.log(lastfmURL);

	artist.on('keydown', (e) => {
		if(e.keyCode === 13) e.preventDefault();
	})

	title.on('keydown', (e) => {
		if(e.keyCode === 13) e.preventDefault();
	})
}



export default covercomplete;