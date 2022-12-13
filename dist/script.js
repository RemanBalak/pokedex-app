let pokemonRepository = (function () {
  let t = [];
  function e(e) {
    'object' == typeof e && 'name' in e && 'detailsUrl' in e
      ? t.push(e)
      : console.log('is not a pokemon');
  }
  function n() {
    return t;
  }
  function i(t) {
    return fetch(t.detailsUrl)
      .then(function (t) {
        return t.json();
      })
      .then(function (e) {
        (t.imageUrlFront = e.sprites.front_default),
          (t.imageUrlBack = e.sprites.back_default),
          (t.height = e.height),
          (t.types = e.types.map(function (t) {
            return t.type.name;
          })),
          (t.abilities = []);
        for (var n = 0; n < e.abilities.length; n++)
          t.abilities.push(e.abilities[n].ability.name);
        t.weight = e.weight;
      })
      .catch(function (t) {
        console.error(t);
      });
  }
  function a(t) {
    i(t).then(function () {
      o(t);
    });
  }
  function o(t) {
    let e = $('.modal-body'),
      n = $('.modal-title');
    n.empty(), e.empty();
    let i = $('<h1>' + t.name + '</h1>'),
      a = $('<img class="modal-img" style="width:50%">');
    a.attr('src', t.imageUrlFront);
    let o = $('<img class="modal-img" style="width:50%">');
    o.attr('src', t.imageUrlBack);
    let l = $('<p>height : ' + t.height + '</p>'),
      s = $('<p>weight : ' + t.weight + '</p>'),
      r = $('<p>types : ' + t.types + '</p>'),
      p = $('<p>abilities : ' + t.abilities + '</p>');
    n.append(i),
      e.append(a),
      e.append(o),
      e.append(l),
      e.append(s),
      e.append(r),
      e.append(p);
  }
  return (
    document.getElementById('search-bar').addEventListener('keyup', () => {
      !(function t() {
        let e = document.querySelectorAll('.card'),
          n = document.getElementById('search-bar').value;
        for (var i = 0; i < e.length; i++)
          e[i].innerText.toLowerCase().includes(n.toLowerCase())
            ? e[i].classList.remove('is-hidden')
            : e[i].classList.add('is-hidden');
      })();
    }),
    {
      add: e,
      getAll: n,
      addListItem: function t(e) {
        pokemonRepository.loadDetails(e).then(function () {
          let t = $('.list'),
            n = $('<div class="card" style="width:250px"></div>'),
            i = $(
              '<img class="card-img-top" alt="Card image" style="width:40%"/>'
            );
          i.attr('src', e.imageUrlFront);
          let o = $(
              '<h5 class="card-title; text-uppercase">' + e.name + '</h5>'
            ),
            l = $('<div class="card-body" style= height:60%"></div>'),
            s = $(
              '<button type="button" id="pokemon-button" class="btn btn-dark" data-toggle="modal" data-target="#pokemonModal">Details</button>'
            );
          t.append(n),
            n.append(i),
            n.append(o),
            n.append(l),
            l.append(s),
            s.on('click', () => {
              a(e);
            }),
            n.on('click', () => {
              a(e);
            });
        });
      },
      loadList: function t() {
        return fetch('https://pokeapi.co/api/v2/pokemon/?limit=150')
          .then(function (t) {
            return t.json();
          })
          .then(function (t) {
            t.results.forEach(function (t) {
              e({ name: t.name, detailsUrl: t.url });
            });
          })
          .catch(function (t) {
            console.error(t);
          });
      },
      loadDetails: i,
      showDetails: a,
      showModal: o,
    }
  );
})();
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (t) {
    pokemonRepository.addListItem(t);
  });
});
