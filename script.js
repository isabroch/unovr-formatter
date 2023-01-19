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

function getData(pkmnClass, pkmnTier) {
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
    obj[i[0]] = i[1].toUpperCase();
    return obj;
  }, {});

  const processedMoveset = getMoveset(moveset, lvl_cap);
  const types = [type_1, type_2].map((type) => {
    if (type) return `:${type}:`;
  }).join(" ").trim();
  return `[table style="border-collapse:separate;border-spacing:5px;float:left;"][tbody][tr][td style="width:100px;height:100px;"][img style="width: 100px;" src="${img}"][/td][/tr]
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
[/tbody][/table]
`;
}

async function handleChange(e) {
  const form = e.currentTarget;

  if (e.target.id == "pkmnClass" || e.target.id == "pkmnTier") {
    const {health, stat_name, stat_roll, lvl_cap} = getData(form.pkmnClass.value, form.pkmnTier.value);
    form.hp.value = `${health}`;
    form.lvl_cap.value = `${lvl_cap}`;
    form.stat.value = `${stat_name}: ${stat_roll}`;
  }

  let pkmn;


  if (e.target.id == "species") {
    pkmn = form.species.value.toLowerCase();
    form.img.value = `https://img.pokemondb.net/sprites/home/normal/${pkmn.replace(" ", "-")}.png`
    try {
      const p = new Pokedex.Pokedex();
      const pkmnData = await p.getPokemonByName(pkmn.replace(" ", "-"));
      form.type_1.value = pkmnData.types[0].type.name;
      form.type_2.value = pkmnData.types[1]?.type?.name ?? '';
    } catch (error) {
      console.warn(`Couldn't automatically update types. Did you spell ${pkmn} correctly?`)
    }
  }


  outputBbcode(form);
}

function outputBbcode(form) {
  const output = document.querySelector("output");

  const formData = new FormData(form);
  document.querySelector('#imgPreview').src = formData.get("img");
  output.textContent = generateBbcode(Object.fromEntries(formData));
}

outputBbcode(document.querySelector('form'));


document.querySelector("#pkmnDetails").addEventListener("change", handleChange);
