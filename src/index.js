import axios from 'axios';
import { Notify } from 'notiflix';
import Simplelightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  endGalleryText: document.querySelector('.end-gallery'),
};

let items = [];
let query = '';
let currentPage = 1;
let currentHits = null;
let value = 0;

refs.form.addEventListener('submit', onClickFormSubmit);

async function fetchData() {
  axios.defaults.baseURL = 'https://pixabay.com/api';

  return await axios
    .get('?key=29539692-12de6be8def0b7ebbead6ba62', {
      params: {
        q: query,
        per_page: 40,
        page: currentPage,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    })
    .then(({ data }) => {
      if (data.totalHits === 0 || query === '') {
        refs.gallery.innerHTML = '';
        refs.loadMoreBtn.classList.add('is-hidden');
        refs.endGalleryText.style.display = 'none';
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        items = data.hits;
        currentHits = data.totalHits;
        value = data.hits.length;
        Notify.success(`Hooray! We found ${currentHits} images.`);
        renderGallery();
        slowlyScroll(2);
        lightbox.refresh();
      }
    })

    .catch(error => console.log(error.message));
}

function renderGallery() {
  const markup = items
    .map(
      items =>
        `<div class="photo-card">
        <a class="photo-link" href="${items.largeImageURL}">
      <img class="card__img" src="${items.webformatURL}" alt="${items.tags}" />
      </a>
      <div class="info">
    <p class="info-item"><b>Likes</b>${items.likes}</p>
      <p class="info-item"><b>Views</b>${items.views}</p>
      <p class="info-item"><b>Comments</b>${items.comments}</p>
     <p class="info-item"><b>Downloads</b>${items.downloads}</p>
      </div>
      </div>`
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

async function onClickFormSubmit(e) {
  e.preventDefault();
  currentPage = 1;
  query = e.target.elements.searchQuery.value;
  refs.gallery.innerHTML = '';
  console.log(query);
  await fetchData();
  console.log(currentHits);
  if (currentHits > 40) {
    refs.loadMoreBtn.classList.remove('is-hidden');
    refs.loadMoreBtn.classList.add('show');
    refs.endGalleryText.classList.add('is-hidden');
  } else {
    refs.loadMoreBtn.classList.add('is-hidden');
    refs.endGalleryText.classList.add('show');
  }
}

refs.loadMoreBtn.addEventListener('click', onClickLoadMore);

function onClickLoadMore() {
  currentPage += 1;
  fetchData();
  lightbox.refresh();

  if (currentHits / value <= currentPage) {
    refs.loadMoreBtn.style.display = 'none';
    refs.endGalleryText.classList.add('show');
  }
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

function slowlyScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
