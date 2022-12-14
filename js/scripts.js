//Start of IIFE
let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  //Adding pokemon
  function add(pokemon) {
    if (
      typeof pokemon === 'object' &&
      'name' in pokemon &&
      'detailsUrl' in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      console.log('is not a pokemon');
    }
  }

  function getAll() {
    return pokemonList;
  }

  //Creating a pokemon list with pokemon cards
  function addListItem(pokemon) {
    pokemonRepository.loadDetails(pokemon).then(function () {
      let list = $('.list');
      let card = $('<div class="card" style="width:250px"></div>');
      let cardImage = $(
        '<img class="card-img-top" alt="Card image" style="width:40%"/>'
      );
      cardImage.attr('src', pokemon.imageUrlFront);
      let cardTitle = $(
        '<h5 class="card-title; text-uppercase">' + pokemon.name + '</h5>'
      );
      let cardBody = $('<div class="card-body" style= height:60%"></div>');
      let detailsButton = $(
        '<button type="button" id="pokemon-button" class="btn btn-dark" data-toggle="modal" data-target="#pokemonModal">Details</button>'
      );

      list.append(card);
      card.append(cardImage);
      card.append(cardTitle);
      card.append(cardBody);
      cardBody.append(detailsButton);

      detailsButton.on('click', () => {
        showDetails(pokemon);
      });
      card.on('click', () => {
        showDetails(pokemon);
      });
    });
  }

  // Fetch & loading data
  function loadList() {
    //$('#loadingDiv').show(); <-- loading spinner js code
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
        //$('#loadingDiv').hide(); <-- loading spinner js code
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        // Now we add the details to the item
        item.imageUrlFront = details.sprites.front_default;
        item.imageUrlBack = details.sprites.back_default;
        item.height = details.height;
        item.types = details.types.map(function (item) {
          return item.type.name;
        });
        item.abilities = [];
        for (var i = 0; i < details.abilities.length; i++) {
          item.abilities.push(details.abilities[i].ability.name);
        }
        item.weight = details.weight;
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  // Function that enables the showing of details on click
  function showDetails(pokemon) {
    // $('#loadingDiv').show(); <-- loading spinner js code
    loadDetails(pokemon).then(function () {
      //$('#loadingDiv').hide(); <-- loading spinner js code
      showModal(pokemon);
    });
  }

  // Creating a modal that will show details
  function showModal(item) {
    let modalBody = $('.modal-body');
    let modalTitle = $('.modal-title');
    modalTitle.empty();
    modalBody.empty();

    let nameElement = $('<h1>' + item.name + '</h1>');
    let imageElementFront = $('<img class="modal-img" style="width:50%">');
    imageElementFront.attr('src', item.imageUrlFront);
    let imageElementBack = $('<img class="modal-img" style="width:50%">');
    imageElementBack.attr('src', item.imageUrlBack);
    let heightElement = $('<p>' + 'height : ' + item.height + '</p>');
    let weightElement = $('<p>' + 'weight : ' + item.weight + '</p>');
    let typesElement = $('<p>' + 'types : ' + item.types + '</p>');
    let abilitiesElement = $('<p>' + 'abilities : ' + item.abilities + '</p>');

    modalTitle.append(nameElement);
    modalBody.append(imageElementFront);
    modalBody.append(imageElementBack);
    modalBody.append(heightElement);
    modalBody.append(weightElement);
    modalBody.append(typesElement);
    modalBody.append(abilitiesElement);
  }

  //Search fiilter

  function liveSearch() {
    let cards = document.querySelectorAll('.card');
    let search_query = document.getElementById('search-bar').value;

    for (var i = 0; i < cards.length; i++) {
      if (
        cards[i].innerText.toLowerCase().includes(search_query.toLowerCase())
      ) {
        cards[i].classList.remove('is-hidden');
      } else {
        cards[i].classList.add('is-hidden');
      }
    }
  }

  let searchInput = document.getElementById('search-bar');

  searchInput.addEventListener('keyup', () => {
    liveSearch();
  });

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
    showModal: showModal,
  };
})();

//end of IIFE

//Loop
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
