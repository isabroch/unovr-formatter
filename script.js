const classes = {
  unequipped: {
    health: 100,
    stat_name: "ATK",
    stat_roll: "20",
    lvl_cap: 10,
  },
  tank: [
    {
      health: 300,
      stat_name: "ATK",
      stat_roll: "d50",
      lvl_cap: 20,
    },
    {
      health: 400,
      stat_name: "ATK",
      stat_roll: "d100",
      lvl_cap: 30,
    },
    {
      health: 500,
      stat_name: "ATK",
      stat_roll: "d150",
      lvl_cap: 50,
    },
    {
      health: 600,
      stat_name: "ATK",
      stat_roll: "d200",
      lvl_cap: 70,
    },
    {
      health: 700,
      stat_name: "ATK",
      stat_roll: "d250",
      lvl_cap: 100,
    },
  ],
  sweeper: [
    {
      health: 150,
      stat_name: "ATK",
      stat_roll: "2d20",
      lvl_cap: 20,
    },
    {
      health: 200,
      stat_name: "ATK",
      stat_roll: "3d20",
      lvl_cap: 30,
    },
    {
      health: 250,
      stat_name: "ATK",
      stat_roll: "4d20",
      lvl_cap: 50,
    },
    {
      health: 300,
      stat_name: "ATK",
      stat_roll: "5d20",
      lvl_cap: 70,
    },
    {
      health: 350,
      stat_name: "ATK",
      stat_roll: "6d20",
      lvl_cap: 100,
    },
  ],
  support: [
    {
      health: 150,
      stat_name: "HEAL",
      stat_roll: "2d12",
      lvl_cap: 20,
    },
    {
      health: 200,
      stat_name: "HEAL",
      stat_roll: "3d12",
      lvl_cap: 30,
    },
    {
      health: 250,
      stat_name: "HEAL",
      stat_roll: "4d12",
      lvl_cap: 50,
    },
    {
      health: 300,
      stat_name: "HEAL",
      stat_roll: "5d12",
      lvl_cap: 70,
    },
    {
      health: 350,
      stat_name: "HEAL",
      stat_roll: "6d12",
      lvl_cap: 100,
    },
  ],
};

const typeColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

let id = 1;
let inventory = JSON.parse(localStorage.getItem('inventory')) ?? {};

function getClassData(pkmnClass, pkmnTier) {
  if (pkmnClass === "unequipped") return classes[pkmnClass.toLowerCase()];
  return classes[pkmnClass.toLowerCase()][parseInt(pkmnTier)];
}

function getMoveset(moveset, lvl_cap) {
  let output = '';

  const sortedMoveset = [...moveset.matchAll(/(T?M?[\d]+) \t([\w ]+) \t(\w+)/gm)].reduce( (moves, match) => {
    const data = { lvl: match[1], name: match[2].trim(), type: match[3].trim() }
    const entries = Object.entries(moves);


    for (let i = 0; i < entries.length ; i++) {
      const range = entries[i][0];

      if (data.used) continue;

      if ((range !== 'TM' && data.lvl.includes("TM")) || data.lvl > parseInt(range) || data.lvl > parseInt(lvl_cap)) continue;


      moves[range].push(data);
      data.used = true;
    }

    return moves;

  }, { 10: [], 20: [], 30: [], 50: [], 70: [], 100: [], TM: []});

  let prevRange = 01;
  Object.entries(sortedMoveset).forEach( set => {
    let [lvlRange, moves] = set;
    if (!moves.length) return;
    let title;
    if (lvlRange === "TM") title = "Extra"
    else title = prevRange + "-" + lvlRange
    output += `[u]${title}[/u] `
    prevRange = parseInt(lvlRange) + 1;
    output += moves.map( i => `[font color="${typeColors[i.type.toLowerCase()]}"]${i.name}[/font]` ).join(", ") + "\n";
  })

  return output;
}

function generateBbcode(data) {
  const { met_at_url, etc, img, type_1, type_2, lvl_cap, moveset } = data;
  const { name, gender, species, met_at_text, pkmnClass, pkmnTier, rarity, stat, hp } = Object.entries(data).reduce((obj, i) => {
    try {
      obj[i[0]] = i[1].toUpperCase();
    } catch (error) {
      obj[i[0]] = i[1];
    }
    return obj;
  }, {});

  const processedMoveset = getMoveset(moveset, lvl_cap);
  const types = [type_1, type_2].map((type) => {
    if (type) return `:${type}:`;
  }).join(" ").trim();
  return `[blockquote][table style="border-collapse:separate;border-spacing:5px;float:left;"][tbody][tr][td style="width:100px;height:100px;"][img style="width: 100px;" src="${img}"][/td][/tr]
[tr]
[td style="padding:3px;text-align:center;"][h1][b]${name}[/b][/h1][/td]
[/tr]
[/tbody][/table][table style="border-collapse:separate;border-spacing:5px;width:395px;"][tbody]
[tr]
[td style="padding:3px;text-align:center;"][h1]${species}[/h1][/td]
[td style="padding:3px;text-align:center;"][h1]${gender}[/h1][/td]
[td style="padding:3px;text-align:center;"]${types}[/td]
[td style="padding:3px;text-align:center;"][h1][a href="${met_at_url}"]${met_at_text}[/a][/h1][/td]
[/tr]
[tr]
[td style="padding:3px;text-align:center;"][h1]${pkmnClass} ${pkmnClass !== 'UNEQUIPPED' ? `T${parseInt(pkmnTier) + 1}` : ''}[/h1][/td]
[td style="padding:3px;text-align:center;"][h1]${hp} HP[/h1][/td]
[td style="padding:3px;text-align:center;"][h1]${stat}[/h1][/td]
[td style="padding:3px;text-align:center;"][h1]${rarity}[/h1][/td]
[/tr][/tbody][/table][table style="border-collapse:separate;border-spacing:5px;width:395px;"][tbody]
[tr][td style="padding:3px; font-size: 10px;"]${processedMoveset}[/td][/tr]
[tr]
[td style="padding:3px; font-size: 10px;"][u]OTHER INFORMATION:[/u] ${etc}
[/td][/tr]
[/tbody][/table][/blockquote]`;
}

function outputBbcode(pkmn = pokemonFromForm(document.querySelector('#pkmnDetails'))) {
  const output = document.querySelector("output");
  document.querySelector('#imgPreview').src = pkmn.img;
  output.textContent = generateBbcode(pkmn);

  if (pkmn.pkmn_id) {
    showPkmnButtons(pkmn)
  }
}

function showPkmnButtons(pkmn) {
  document.querySelector('#action').textContent = `Editing ${pkmn.name} ∙ ${pkmn.species} (${pkmn.pkmnClass}${pkmn.pkmnClass !== 'unequipped' ? ` T${parseInt(pkmn.pkmnTier) + 1}` : ''})`;
  document.querySelector('#delete').classList.remove('hide');
  document.querySelector('#delete').textContent = `Delete ${pkmn.name}`;
  document.querySelector('#create').textContent = `Update ${pkmn.name}`;
  document.querySelector('#clear').textContent = `New Pokemon`;
}

outputBbcode();

async function handleChange(e) {
  const form = e.currentTarget;

  if (e.target.id == "pkmnClass" || e.target.id == "pkmnTier") {
    const {health, stat_name, stat_roll, lvl_cap} = getClassData(form.pkmnClass.value, form.pkmnTier.value);
    form.hp.value = `${health}`;
    form.lvl_cap.value = `${lvl_cap}`;
    form.stat.value = `${stat_name}: ${stat_roll}`;
  }

  let pkmn;

  if (e.target.id == "species") {
    pkmn = form.species.value.toLowerCase();
    form.img.value = `https://img.pokemondb.net/sprites/home/normal/${pkmn.replace(" ", "-")}.png`
    document.querySelector('#imgPreview').src = form.img.value;

    try {
      const p = new Pokedex.Pokedex();
      const pkmnData = await p.getPokemonByName(pkmn.replace(" ", "-"));
      form.type_1.value = pkmnData.types[0].type.name;
      form.type_2.value = pkmnData.types[1]?.type?.name ?? '';
    } catch (error) {
      console.warn(`Couldn't automatically update types. Did you spell ${pkmn} correctly?`)
    }
  }
}

function pokemonFromForm(form) {
  const formData = new FormData(form);
  const pkmn = Object.fromEntries(formData);
  return pkmn;
}

handleReset();

document.querySelector("#pkmnDetails").addEventListener("change", handleChange);

document.querySelector("#pkmnDetails").addEventListener("click", e => {
  const pkmn = pokemonFromForm(e.currentTarget);

  switch (e.target.id) {
    case 'delete':
      handleReset();
      deletePkmn(pkmn);
      break;

    case 'clear':
      handleReset();
      break;

    case 'create':
      e.preventDefault();
      outputBbcode(pkmn);
      savePkmn(pkmn);
      return false;
      break;

    default:
      break;
  }
} );

function handleReset() {
  document.querySelector('#pkmnDetails').reset();
  document.querySelector('#pkmn_id').value = ""; // hidden field, manual reset
  document.querySelector('#lvl_cap').value = ""; // hidden field, manual reset
  document.querySelector('#imgPreview').src = "";
  document.querySelector("#delete").classList.add('hide');
  document.querySelector("#create").textContent = 'Submit';
  document.querySelector("#clear").textContent = 'Clear Form';
  document.querySelector('output').textContent = '';
  document.querySelector('#action').textContent = "Creating Pokemon";
}

function deletePkmn(pkmn) {
  document.querySelector(`button[data-id="${pkmn.pkmn_id}"]`).remove();
  delete inventory[pkmn.pkmn_id];
  localStorage.setItem('inventory', JSON.stringify(inventory));

}


function savePkmn(pkmn) {
  if (!pkmn.pkmn_id)
  { pkmn.pkmn_id = id++; }

  makePkmnButton(pkmn);

  document.querySelector('#pkmnDetails').pkmn_id = pkmn.pkmn_id;

  inventory[pkmn.pkmn_id] = pkmn;

  localStorage.setItem('inventory', JSON.stringify(inventory));

  showPkmnButtons(pkmn);
}

function makePkmnButton(pkmn) {
  let button = document.querySelector(`.pkmn-storage [data-id="${pkmn.pkmn_id}"]`) ?? document.createElement('button');

  button.dataset.id = pkmn.pkmn_id;
  button.type = "button";
  button.textContent = `${pkmn.name} ∙ ${pkmn.species} (${pkmn.pkmnClass}${pkmn.pkmnClass !== 'unequipped' ? ` T${parseInt(pkmn.pkmnTier) + 1}` : ''})`;

  if (button.parentElement === null) {
    document.querySelector('.pkmn-storage').insertAdjacentElement('beforeend', button);
  }
}

function loadInventory() {
  if (!inventory || Object.entries(inventory).length == 0) {
    return;
  }

  // get highest id
  Object.entries(inventory).forEach( ([, pkmn]) => {
    const currId = parseInt(pkmn.pkmn_id);
    if (currId >= id) {
      id = currId + 1;
    }

    makePkmnButton(pkmn);
  })
}

loadInventory();

function loadPokemon(id) {
  const pkmn = inventory[id];
  for (const key in pkmn) {
    document.getElementById(key).value = pkmn[key];
  }
  outputBbcode(pkmn);
  showPkmnButtons(pkmn);
}

document.querySelector('.pkmn-storage').addEventListener('click', (e) => {
  if (!e.target.dataset.id) return;
  loadPokemon(e.target.dataset.id);
});