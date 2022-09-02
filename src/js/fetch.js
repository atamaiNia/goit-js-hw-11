import axios from 'axios';

export default async function fetchData(query, currentPage) {
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
    .then(response => response.data);
}
