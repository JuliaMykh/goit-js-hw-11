import { fetchImages } from './fetch-images';
// import imageСardTemplate from './card-templates.hbs';
import { imageСardTemplate } from './template';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const { searchForm, gallery, loadMoreBtn, endCollectionText } = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  endCollectionText: document.querySelector('.end-collection-text'),
};

//рендеремо розмітку
function renderCardImage(arr) {
  const markup = arr.map(item => imageСardTemplate(item)).join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

searchForm.addEventListener('submit', onSubmitSearchForm);
loadMoreBtn.addEventListener('click', onClickLoadMoreBtn);

// функція введення запиту в інпут
async function onSubmitSearchForm(e) {
  e.preventDefault();
  // значення того, що вводимо в інпут
  searchQuery = e.currentTarget.searchQuery.value;
  currentPage = 1;
  // якщо пошук порожній - виходимо
  if (searchQuery === '') {
    return;
  }

  try {
    //  функція пошуку зображень
    const response = await fetchImages(searchQuery, currentPage);
    currentHits = response.hits.length;

    // якщо більше 40 знайдених зображень - прибираємо клас хідден у кнопки Завантажити ще
    if (response.totalHits > 40) {
      loadMoreBtn.classList.remove('is-hidden');
    } else {

      // якщо ні - додаємо
      loadMoreBtn.classList.add('is-hidden');
    }

    if (response.totalHits > 0) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      gallery.innerHTML = '';
      // рендеремо стільки розмітки, скільки знайшли зображень
      renderCardImage(response.hits);
      // обов,язковий метод після додавання групи зображень
      lightbox.refresh();
      // додаємо клас хідден тексту про кінець колекціі
      // endCollectionText.classList.add('is-hidden');

      // скрол сторінки
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    // якщо нічого не знайдено
    if (response.totalHits === 0) {
      // в галерею нічого не додається
      gallery.innerHTML = '';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      
      // ховаємо кнопку і текст у кінці
      // loadMoreBtn.classList.add('is-hidden');
      // endCollectionText.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}
// функція при кліку по кнопці Завантажити ще
async function onClickLoadMoreBtn() {
  // збільшуємо сторінку на 1
  currentPage += 1;
  // виклик функціі пошуку зображень
  const response = await fetchImages(searchQuery, currentPage);
  // рендеремо розмітку скільки знайшли ще зображень
  renderCardImage(response.hits);
  lightbox.refresh();
  // додаємо нові знайдені зображення
  currentHits += response.hits.length;
  // якщо поточна кількість зображень дорівнює тотал, то
  if (currentHits === response.totalHits) {
    // ховаємо кнопку завантажити ще
    loadMoreBtn.classList.add('is-hidden');
    // знімаємо клас хідден з тексту про кінець колекціі
    endCollectionText.classList.remove('is-hidden');
  }
}
