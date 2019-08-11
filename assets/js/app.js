// Initial Values
const API_KEY = '25M6AUpMu4QVl6CarZO1lGC6p2aHbT60';
const endpoint = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}`;
const giphys = ['Donald Trump', 'Barack Obama', 'Lion'];
let buttons = ['Cats', 'Dogs', 'Lions'];



function loadButtons() {
    const data = JSON.parse(localStorage.getItem('buttons'));

    if (data && data.length > 0) {
        buttons = data;
    }
}

// Render buttons
function renderButtons() {
    $('.recent-search').empty();

    for (let i = 0; i < buttons.length; i++) {
        const button = `<button
            data-name="${buttons[i]}"
            class="btn btn-primary"
        >
        ${buttons[i]}
        </button>`;

        $('.recent-search').append(button);
    }

    // Save to localStorage
    localStorage.setItem('buttons', JSON.stringify(buttons));
}

// Render Giphys
function renderGiphy(giphys) {
    $('.giphy-content').empty();

    for (let i = 0; i < giphys.length; i++) {
        const images = giphys[i].images;
        const image = `<img
            src="${images.original_still.url}"
            data-still="${images.original_still.url}"
            data-animate="${images.original.url}"
            data-state="still"
            width="${images.original.width}px"
            height="${images.original.height}px"
        />`;

        $('.giphy-content').append(image);
    }

}

// Fetch Giphys
function fetchGiphy(value) {
    const url = endpoint + '&q=' + value;

    $.ajax({
            url,
        })
        .then((response) => renderGiphy(response.data))
        .catch((error) => {
            console.log('Error: ', error);
        });
}


// Search giphys on search
$('#submit-button').on('click', (event) => {
    event.preventDefault();
    const value = $('#search').val();

    fetchGiphy(value);
    buttons.push(value);
    renderButtons();

    $('#search').val('');
});


// Fetch giphys on click
$(document).on('click', 'button', function () {
    console.log('Hello World');
    const value = $(this).attr('data-name');

    fetchGiphy(value);
});


// Animate Images
$(document).on('click', 'img', function () {
    const still = $(this).attr('data-still');
    const animate = $(this).attr('data-animate');
    const state = $(this).attr('data-state');

    if (state === 'still') {
        $(this).attr({
            'src': animate,
            'data-state': 'animate'
        });
    } else {
        $(this).attr({
            'src': still,
            'data-state': 'still'
        });
    }
});


function randomValue(values) {
    const index = Math.floor(Math.random() * values.length);
    const value = values[index];
    return value;
}

function initApp() {
    const value = randomValue(giphys);

    loadButtons();
    renderButtons();
    fetchGiphy(value);
}


// Initialize the APP
initApp();