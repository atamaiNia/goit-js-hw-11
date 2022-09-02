import fetchData from './js/fetch';
import renderGallery from './js/render';
import { Notify } from 'notiflix';
import { lightbox } from './js/lightbox';
import slowlyScroll from './js/slowly-scroll';
import './css/styles.css';

const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtnRef = document.querySelector('.load-more');
const endGalleryTextRef = document.querySelector('.end-gallery');

let query = '';
let currentPage = 1;
let hits = 0;

formRef.addEventListener('submit', onClickFormSubmit);

async function onClickFormSubmit(e) {
  e.preventDefault();
  currentPage = 1;
  query = e.target.elements.searchQuery.value.trim();
  if (query === '') {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    galleryRef.innerHTML = '';
    loadMoreBtnRef.classList.add('is-hidden');
    endGalleryTextRef.classList.add('is-hidden');
    return;
  }

  const response = await fetchData(query, currentPage);
  hits = response.hits.length;

  if (response.totalHits > 40) {
    loadMoreBtnRef.classList.remove('is-hidden');
    endGalleryTextRef.classList.add('is-hidden');
  } else {
    loadMoreBtnRef.classList.add('is-hidden');
    endGalleryTextRef.classList.remove('is-hidden');
  }

  try {
    if (response.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      galleryRef.innerHTML = '';
      loadMoreBtnRef.classList.add('is-hidden');
      endGalleryTextRef.classList.add('is-hidden');
    }
    if (response.totalHits > 0) {
      galleryRef.innerHTML = '';
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      renderGallery(response.hits, galleryRef);
      slowlyScroll(1);
      lightbox.refresh();
    }
  } catch (error) {
    console.log(error);
  }
}

loadMoreBtnRef.addEventListener('click', onClickLoadMore);

async function onClickLoadMore() {
  currentPage += 1;
  const response = await fetchData(query, currentPage);
  renderGallery(response.hits, galleryRef);
  slowlyScroll(2);
  lightbox.refresh();
  hits += response.hits.length;

  if (hits === response.totalHits) {
    loadMoreBtnRef.classList.add('is-hidden');
    endGalleryTextRef.classList.remove('is-hidden');
  }
}
