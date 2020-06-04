var pokemonRepository = (function() {
    var repository = [];
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  
    var add =(pokemon) => {
      repository.push(pokemon);
    }
  
    var getAll = () => {
      return repository;
    }
  
    var addListItem = (pokemon) => {
      var $pokemonList = $('.pokemon-list');
      var $listItem = $('<li>');
      var $button = $('<button class="poke-btn">' + pokemon.name + '</button>');
      $listItem.append($button);
      $pokemonList.append($listItem);
      $button.on('click', function(e) {
        showDetails(pokemon);
      });
    }
  
    var showDetails = (item) => {
      pokemonRepository.loadDetails(item).then(function() {
        console.log(item);
        showModal(item);
      });
    }
  
    var loadList = () => {
      return $.ajax(apiUrl)
        .then(function(json) {
          json.results.forEach(function(item) {
            var pokemon = {
              name: item.name,
              detailsUrl: item.url
            };
            add(pokemon);
          });
        })
        .catch(function(e) {
          console.error(e);
        });
    }
  
    var loadDetails = (item) => {
      var url = item.detailsUrl;
      return $.ajax(url)
        .then(function(details) {
          // add the details to the item
          item.imageUrl = details.sprites.front_default;
          item.height = details.height;
          // loop for each of the pokemon types
          item.types = [];
          for (var i = 0; i < details.types.length; i++) {
            item.types.push(details.types[i].type.name);
          }
  
          item.abilities = [];
          for (var i = 0; i < details.abilities.length; i++) {
            item.abilities.push(details.abilities[i].ability.name);
          }
  
          item.weight = details.weight;
          return item;
        })
        .catch(function(e) {
          console.error(e);
        });
    }
    // Show modal content
    function showModal(item) {
      var $modalContainer = $('#modal-container');
      $modalContainer.empty();
      var modal = $('<div class="modal-container"></div>');
      var nameElement = $('<h1 class="poke-name-title">' + item.name + '</h1>');
      var imageElement = $('<img class="modal-image">');
      imageElement.attr('src', item.imageUrl);
      var heightElement = $('<p class="p-details">' + 'height : ' + item.height + 'm' + '</p>');
      var weightElement = $('<p class="p-details">' + 'weight : ' + item.weight + 'kg' + '</p>');
      var typesElement = $('<p class="p-details">' + 'types : ' + item.types + '</p>');
      var abilitiesElement = $('<p class="p-details">' + 'abilities : ' + item.abilities + '</p>');
      var closeButtonElement = $('<button class="modal-close">X</button>');
      closeButtonElement.on('click', hideModal);
      // Append content to site
      modal.append(closeButtonElement);
      modal.append(nameElement);
      modal.append(imageElement);
      modal.append(heightElement);
      modal.append(weightElement);
      modal.append(typesElement);
      modal.append(abilitiesElement);
      $modalContainer.append(modal);
      // Add class to show modal
      $modalContainer.addClass('is-visible');
    }
  
    // hides modal when close button is clicked
    var hideModal = () => {
      var $modalContainer = $('#modal-container');
      $modalContainer.removeClass('is-visible');
    }
  
    // Hides model when ESC is clicked
    jQuery(window).on('keydown', e => {
      var $modalContainer = $('#modal-container');
      if (e.key === 'Escape' && $modalContainer.hasClass('is-visible')) {
        hideModal();
      }
    });
  
    // Hides modal if clicked outside of it
    var $modalContainer = document.querySelector('#modal-container');
    $modalContainer.addEventListener('click', e => {
      var target = e.target;
      if (target === $modalContainer) {
        hideModal();
      }
    });
  
    return {
      add: add,
      getAll: getAll,
      addListItem: addListItem,
      loadList: loadList,
      loadDetails: loadDetails,
      showModal: showModal,
      hideModal: hideModal
    };
  })();
  
  pokemonRepository.loadList().then(function() {
    // Now the data is loaded!
    pokemonRepository.getAll().forEach(function(pokemon) {
      pokemonRepository.addListItem(pokemon);
    });
  });