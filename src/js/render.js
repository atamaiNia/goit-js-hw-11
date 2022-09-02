export default function renderGallery(arr, galleryRef) {
  const markup = arr
    .map(
      item => `<div class="photo-card">
        <a class="photo-link" href="${item.largeImageURL}">
      <img class="card__img" src="${item.webformatURL}" alt="${item.tags}" />
      </a>
      <div class="info">
    <p class="info-item"><b>Likes</b>${item.likes}</p>
      <p class="info-item"><b>Views</b>${item.views}</p>
      <p class="info-item"><b>Comments</b>${item.comments}</p>
     <p class="info-item"><b>Downloads</b>${item.downloads}</p>
      </div>
      </div>`
    )
    .join('');

  galleryRef.insertAdjacentHTML('beforeend', markup);
}
