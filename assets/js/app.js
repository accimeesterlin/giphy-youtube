// Initial Values
const API_KEY = '25M6AUpMu4QVl6CarZO1lGC6p2aHbT60';
const endpoint = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}`;
const giphys = ['Donald Trump', 'Barack Obama', 'Lion'];
let buttons = ['Cats', 'Dogs', 'Lions'];
let favorites = [];
let isFavoriteOnly = false;
let currentSearch = [];

// load buttons from localStorage
function loadButtons() {
    const listButtons = JSON.parse(localStorage.getItem('buttons'));

    if (listButtons && listButtons.length > 0) {
        buttons = listButtons;
    }
}

// Save to localStorage
function saveButtonsToLocalStorage(buttons) {
    localStorage.setItem('buttons', JSON.stringify(buttons));
}

// Render buttons
function renderButtons() {
    $('.recent-search').empty();

    for (let i = 0; i < buttons.length; i++) {
        const buttonName = buttons[i];

        const button = `<div class="buttons">
                <button
                    data-name="${buttonName}"
                    class="btn btn-search"
                >
                ${buttonName}
                </button>
                <button
                    data-name="${buttonName}"
                    class="btn btn-close fas fa-times">
                </button>
        </div>`;

        $('.recent-search').append(button);
    }

    saveButtonsToLocalStorage(buttons);
}

// Create giphy section mock up
function createGiphyTemplate(giphy) {
    const images = giphy.images;
    const starredIndex = favorites.indexOf(giphy.id);
    const isStar = starredIndex === -1;

    return `<div class="giphy">
            <i class="${!isStar ? 'fas' : 'far'} fa-star favorite"
                data-id="${giphy.id}" data-star="${isStar ? 'false' : 'true'}">
            </i>
            <div class="giphy-image">
                <img
                    src="${images.original_still.url}"
                    data-still="${images.original_still.url}"
                    data-animate="${images.original.url}"
                    data-state="still"
                />
                <i class="fa fa-play img-play"></i>
            </div>
            <div class="giphy-info">
                <p>Rating: ${giphy.rating}</p>
                <p>Posted A Year Ago</p>
            </div>

            <div class="giphy-footer" data-link="${giphy.embed_url}"> 
                <p>Copy Link <i class="fa fa-link"></i></p>
            </div>
    </div>`;
}

// Render Giphys
function renderGiphy(giphys) {
    $('.giphy-content').empty();

    for (let i = 0; i < giphys.length; i++) {
        const giphy = giphys[i];
        const giphyTemplate = createGiphyTemplate(giphy);

        $('.giphy-content').append(giphyTemplate);
    }
}

// Fetch Giphys
function fetchGiphy(value) {
    const url = endpoint + '&q=' + value;

    $.ajax({ url })
        .then((response) => {
            renderGiphy(response.data);
            currentSearch = response.data;
        })
        .catch((error) => {
            // TODO:
            // Handle errors
            console.log('Error: ', error);
        });
}

function randomValue(values) {
    const index = Math.floor(Math.random() * values.length);
    const value = values[index];
    return value;
}

// Once image clicked
function imgCardClick() {
    const giphyCard = $(this);

    const image = giphyCard.find('img');
    const iconPlay = giphyCard.find('i');
    
    const still = image.attr('data-still');
    const animate = image.attr('data-animate');
    const state = image.attr('data-state');

    if (state === 'still') {
        image.attr({
            'src': animate,
            'data-state': 'animate'
        });

        iconPlay.removeClass('img-play');
    } else {
        iconPlay.addClass('img-play');
        image.attr({
            'src': still,
            'data-state': 'still'
        });
    }
}


function copyLink() {
    const url = $(this).attr('data-link');

    // TODO:
    // Find out how we can get execCommand working on attributes
    const temp = $("<input>");
    $('body').append(temp);
    temp.val(url).select();
    document.execCommand("copy");
    temp.remove();

    $(this).html('Copied!!!');

    setTimeout(() => $(this).html(`
        <p>Copy Link <i class="fa fa-link"></i></p>
    `), 3000);
}

function removeButton() {
    const text = $(this).attr('data-name');

    const newButtons = filterByValue(buttons, text);
    buttons = newButtons;
    renderButtons();
}

function searchGiphyByButton() {
    const value = $(this).attr('data-name');

    uncheckFavorite();
    fetchGiphy(value);
}

function clearResult(event) {
    event.preventDefault();

    uncheckFavorite();
    $('.giphy-content').empty();
    $('.giphy-content').append('<p>Search cleared!!</p>');
}

function searchGiphy(event) {
    event.preventDefault();
    const value = $('#search').val();

    uncheckFavorite();
    fetchGiphy(value);
    buttons.push(value);
    renderButtons(value);

    $('#search').val('');
}

function disableSearchButton() {
    const value = $(this).val();

    if (value) {
        $('#submit-button').prop('disabled', false);
    } else {
        $('#submit-button').prop('disabled', true);
    }
}



/*
    ###############################################
    ################### PART 2 ####################
    ###############################################
*/
function uncheckFavorite() {
    $('#favorite-only').prop('checked', false);
}

// Render favorite giphys
function renderFavoriteGiphy(giphy) {
    const giphyTemplate = createGiphyTemplate(giphy);

    $('.giphy-content').append(giphyTemplate);;
}

function addToFavorite(id) {
    favorites.push(id);
    setFavorite();
}

// favorite to localStorage
function setFavorite() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function removeFavorite(id) {
    favorites = filterByValue(favorites, id);
    setFavorite();
}

function filterByValue(list, value) {
    const arr = list.filter((el) => el !== value);
    return arr;
}

// Load favorites from localStorage
function loadFavorites() {
    const stars = JSON.parse(localStorage.getItem('favorites'));

    if (Array.isArray(stars)) {
        favorites = stars
    }
}

function addOrRemoveFavorite() {
    const startState = $(this).attr('data-star');
    const id = $(this).attr('data-id');

    if (startState === 'false') {
        addToFavorite(id);
        $(this).removeClass('far').addClass('fas');
        $(this).attr('data-star', 'true');
    } else {
        removeFavorite(id);
        $(this).removeClass('fas').addClass('far');
        $(this).attr('data-star', 'false');
    }
}

function searchFavorites() {
    isFavoriteOnly = $(this).is(':checked');

    if (isFavoriteOnly) {
        $('.giphy-content').empty();

        for(let i = 0; i < favorites.length; i++) {
            const url = `https://api.giphy.com/v1/gifs/${favorites[i]}?api_key=25M6AUpMu4QVl6CarZO1lGC6p2aHbT60`;

            $.ajax({ url })
                .then((response) => renderFavoriteGiphy(response.data))
                .catch(() => {
                    console.log('Error happened!!!');
                });
        }
    } else {
        renderGiphy(currentSearch);
    }
}


$(document).on('click', '.giphy-image', imgCardClick);
$(document).on('click', '.giphy-footer', copyLink);
$(document).on('click', '.btn-close', removeButton);
$(document).on('click', '.btn-search', searchGiphyByButton);
$(document).on('click', '.favorite', addOrRemoveFavorite);


$('#favorite-only').on('click', searchFavorites);
$('#clear-results').on('click', clearResult);
$('#submit-button').on('click', searchGiphy);
$('#search').on('keyup', disableSearchButton);



function initApp() {
    const value = randomValue(giphys);

    loadFavorites();
    loadButtons();
    renderButtons();
    fetchGiphy(value);
}

// Initialize the APP
initApp();