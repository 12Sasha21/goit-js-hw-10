import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

input.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));

function onCountryInput() {
  const name = input.value.trim();
  if (name === '') {
    return (list.innerHTML = ''), (info.innerHTML = '');
  }
  fetchCountries(name)
    .then(country => {
      list.innerHTML = '';
      info.innerHTML = '';
      if (country.length === 1) {
        list.insertAdjacentHTML('afterbegin', renderCountryList(country));
        info.insertAdjacentHTML('afterbegin', renderCountryInfo(country));
      } else if (country.length >= 10) {
        alertTooManyMatches();
      } else {
        list.insertAdjacentHTML('beforeend', renderCountryList(country));
      }
    })
    .catch(alertWrongName);
}

function renderCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
            <li class="country-item" >
              <img src="${flags.svg}" alt="Flag of ${name.official}" width=50 height=30>
              <h2>${name.official}</h2>
            </li>
            `;
    })
    .join('');
  return markup;
}

function renderCountryInfo(country) {
  const markup = country
    .map(({ capital, population, languages, flags, name }) => {
      return `
            <ul>
              <li><b>Capital:</b> ${capital}</li>
              <li><b>Population:</b> ${population}</li>
              <li><b>Languages:</b> ${Object.values(languages).join(', ')}</li>
            </ul>
            `;
    })
    .join('');
  return markup;
}

function alertWrongName() {
  Notify.failure('Oops, there is no country with that name');
}

function alertTooManyMatches() {
  Notify.info('Too many matches found. Please enter a more specific name.');
}
