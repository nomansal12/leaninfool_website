const contactBtn = document.getElementById('contact');
const contactModal = document.getElementById('contact-modal');
const closeContact = document.getElementById('close-contact-modal');

contactBtn.addEventListener('click', () => {
    contactModal.showModal();
})

// Close modal on button click
closeContact.addEventListener('click', () => {
    contactModal.close(); // Close the dialog
});

// Close modal when clicking outside of it
contactModal.addEventListener('click', (event) => {
    if (event.target === contactModal) {
        contactModal.close();
    }
});



// Fetch the JSON data
fetch('beats.json')
    .then(response => response.json()) // Parse JSON
    .then(data => {
        const beatsContainer = document.querySelector('.beats'); // Get the beats container
        const modal = document.querySelector('dialog'); // Select the <dialog> element
        const modalAudio = document.getElementById('modal-audio'); // Modal audio
        const closeModal = document.getElementById('close-modal'); // Close button 

        // Loop through the data and create elements dynamically
        data.forEach((beat) => {
            const beatBox = document.createElement('div'); // Create a new div for each beat
            beatBox.classList.add('beat-box'); // Add a class for styling

            // Create the play button
            const playButton = document.createElement('button');
            playButton.classList.add('play-button');

            // Create a container for title and tag
            const beatDetails = document.createElement('div');
            beatDetails.classList.add('beat-details');

            // Create title and description for each beat
            const beatTitle = document.createElement('h2');
            beatTitle.textContent = beat.title; // Set the title

            const beatTag = document.createElement('p');
            beatTag.textContent = beat.tag; // Set the description

            // Append title and tag to the details container
            beatDetails.appendChild(beatTitle);
            beatDetails.appendChild(beatTag);

            // Append the play button and details to the beatBox
            beatBox.appendChild(playButton);
            beatBox.appendChild(beatDetails);
            
            beatBox.addEventListener('click', () => {
                modalControls(data, beat);
                modal.showModal(); // Open the dialog
            });

            // Append the beatBox to the beats container
            beatsContainer.appendChild(beatBox);
        });

        // Close modal on button click
        closeModal.addEventListener('click', () => {
            modal.close(); // Close the dialog
            audio.pause();
        });

        // Close modal when clicking outside of it
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.close();
                audio.pause();
            }
        });

        
    })
    .catch(error => console.error('Error loading the JSON data:', error));


// function to handle all audio controls
function modalControls(data, beat) {
    const modalTitle = document.getElementById('modal-title'); // Modal title
    const modalImg = document.getElementById('modal-img');
    const playBtn = document.querySelector('#play');
    const prevBtn = document.querySelector('#prev');
    const nextBtn = document.querySelector('#next');
    const audio = document.querySelector('#audio');
    const progress = document.querySelector('.progress');
    const progressContainer = document.querySelector('.progress-container');
    let isPlaying = false;
    let currentBeatIndex = beat.index;

    loadBeat(beat);

    function loadBeat(beat){
        audio.src = beat.audio;
        modalTitle.textContent = beat.title; // Set modal title
        modalImg.src = beat.img;
        playBeat();
    }


    function playBeat() {
        isPlaying = true;
        playBtn.querySelector('i.fa-solid').classList.remove('fa-circle-play');
        playBtn.querySelector('i.fa-solid').classList.add('fa-circle-pause');
    
        audio.play();
    }
    
    function pauseBeat() {
        isPlaying = false;
        playBtn.querySelector('i.fa-solid').classList.add('fa-circle-play');
        playBtn.querySelector('i.fa-solid').classList.remove('fa-circle-pause');
    
        audio.pause();
    }

    function prevBeat() {
        currentBeatIndex--;
        
        // if we are at first song, and go back, set it to last song
        if (currentBeatIndex < 0) {
            currentBeatIndex = data.length - 1;
        }

        loadBeat(data[currentBeatIndex]);
        playBeat();
    }

    function nextBeat() {
        currentBeatIndex++;

        if (currentBeatIndex > data.length - 1){
            currentBeatIndex = 0
        }

        loadBeat(data[currentBeatIndex])
        playBeat();
    }
    
    function updateProgress(e) {
        const {duration, currentTime} = e.srcElement;
        const progressPercent = (currentTime / duration) * 100
        progress.style.width = `${progressPercent}%`
    }

    function setProgress(e){
        const width = this.clientWidth
        const clickX = e.offsetX
        const duration = audio.duration;

        audio.currentTime = (clickX / width) * duration;
    }

    playBtn.addEventListener('click', () => {
        // if song is playing, pause it
        if (isPlaying){
            pauseBeat();
        } else {
            playBeat();
        }
    })

    prevBtn.addEventListener('click', prevBeat);
    nextBtn.addEventListener('click', nextBeat);

    audio.addEventListener('timeupdate', updateProgress);

    progressContainer.addEventListener('click', setProgress);
}

