import axios from 'axios';

export async function fetchImages(value, page) {
  const url = 'https://pixabay.com/api/';
  const key = '29178244-3f7bc3a9b23228b3a0c269efa';
  const filter = `?key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  return await axios.get(`${url}${filter}`).then(response => response.data);
}

