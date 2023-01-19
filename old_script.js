async function getPage(path) {
  const resp = await fetch(`https://bulbapedia.bulbagarden.net/${path}`);
  const data = await resp.text();
  const dom = new DOMParser().parseFromString(data, "text/html");
  return dom;
}

async function getPokedex() {
  const cachedPokedex = localStorage.getItem("pokedex");
  if (cachedPokedex) {
    // return new Map(JSON.parse(cachedPokedex));
  }

  // build national pokedex
  const data = await getPage("wiki/List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number");

  const pokedex = new Map();
  let id = "#0001";
  data.querySelectorAll("h3 + .roundy td:has(a[href$='(Pok%C3%A9mon)']:not(:has(img)))").forEach( cell => {
    let species, form, path, types;

    species = cell.querySelector('a').textContent;
    form = cell.querySelector('small')?.textContent;
    path = cell.querySelector('a').pathname;

    const hasId = cell.parentElement.querySelector('td[style="font-family:monospace,monospace"]')?.textContent;
    if (hasId) {
      id = hasId
    }
    types = [...cell.parentElement.querySelectorAll('td[style*="background"')].map(x => x.textContent.trim());

    pokedex.set(`${species}${form ? ` - ${form}` : ''}`, {id, species, form, path, types})
  })

  // cache the pokedex
  localStorage.setItem("pokedex", JSON.stringify([...pokedex]));

  return pokedex;
}

function populateSpeciesSelect(pokedex) {
  const select = document.getElementById('species');
  pokedex.forEach(function(pkmn, key) {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = key;
    select.insertAdjacentElement('beforeend', opt);
  });
}

async function start() {
  pokedex = await getPokedex();

  // make table for quick work
  pokedex.forEach( (pkmn, key) => {
    document.querySelector('#help').insertAdjacentHTML('beforeend', `<tr><td>${pkmn.id}</td>
    <td>${pkmn.species}</td>
    <td>${pkmn.form}</td>
    <td>${pkmn.types[0]}</td>
    <td>${pkmn.types[1] ?? ''}</td>
    <td></td></tr>`)
  })

  document.getElementById('pkmnDetails').addEventListener('change', (e) => handleFormChange(e, pokedex))
}

function handleFormChange(e, pokedex) {
  const input = e.target;

  if (['species', 'pkmnClass', 'pkmnTier'].includes(input.id)) {
    updatePkmnForm(pokedex)
  }
}

function updatePkmnForm(pokedex) {
  const pkmn = document.getElementById("species").value;
  const pkmnClass = document.getElementById("pkmnClass").value;
  const pkmnTier = document.getElementById("pkmnTier").value;

  if (pkmn) {
    // update types
    const types = pokedex.get(pkmn).types;
    document.getElementById("type_1").value = types[0].toLowerCase();
    if (types.length > 1) {
      document.getElementById("type_2").value = types[1].toLowerCase();
    } else {
      document.getElementById("type_2").value = "";
    }

    // update rarity
  }

  if (pkmnClass) {

  }

}

start();