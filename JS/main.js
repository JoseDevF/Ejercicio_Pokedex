const apiUrl = "https://pokeapi.co/api/v2/pokemon/"

const inputSearch = document.querySelector('#inputSearch');
const searchButton = document.querySelector('#searchButton');
const pokemonInfo = document.querySelector('#pokemonInfo');
const canvaContainer = document.querySelector('#graphic')

function handleRequestSearch(event) {
    /* Saneamiento de entrada: convertimos a minusculas */
    const pokemonName = inputSearch.value.toLowerCase();
    fetch(`${apiUrl}${pokemonName}`)
        .then(response => {
            console.log("Respuesta: ", response);
            return response.json();
        })
        .then(data => {
            console.log(data);
            displayPokemon(data)
        })
        .catch(err => {
            console.error(err)
            showErrorMessage();
        });
}

function displayPokemon(pokemon) {
    pokemonInfo.innerHTML = `
        <h2>${capitalizeFirstLetter(pokemon.name)}</h2>
        <img src="${pokemon.sprites.front_default}">
        <p>Peso: ${pokemon.weight} Lbs</p>
        <p>Altura: ${pokemon.height} In</p>
        <h3>Habilidades</h3>
        <ul>
        ${pokemon.abilities
            .map(element => `<li>${capitalizeFirstLetter(element.ability.name)}</li>`)
            .join("")
        }
        </ul>
        <h3>Movimientos</h3>
        <ul>
        ${pokemon.moves
            .slice(0, 5)
            .map(element => `<li>${capitalizeFirstLetter(element.move.name)}</li>`)
            .join("")
        }
        </ul>
    `
    const arrayStats = pokemon.stats.map(element => element.base_stat);
    /* Mockup data */
    const data = {
        labels: [
            'HP',
            'ATTACK',
            'DEFENSE',
            'SPECIAL-ATTACK',
            'SPECIAL-DEFENSE',
            'SPEED',
        ],
        datasets: [{
            label: pokemon?.name ?? "", /* Debe ser dinámico */
            data: [...arrayStats], /* Debe ser dinámico */
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
        }]
    };

    /* Config  */
    const config = {
        type: 'radar',
        data: data,
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        },
    };
    const canva = document.createElement('canvas')
    canvaContainer.appendChild(canva)

    new Chart(canva, config, data)
}

const showErrorMessage = () => pokemonInfo.innerHTML = `<p>No se encontró información para el Pokémon ingresado. Intente nuevamente.</p>`

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

searchButton.addEventListener('click', handleRequestSearch)
