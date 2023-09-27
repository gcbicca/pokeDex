const getTypeColor = (type) => {
  // é uma expressão com um operador lógico OU que se a expressão do lado esquerdo é um valor truthy ele retorna o a cor do respectivo par passado como argumento, ele acessa
  // dinamicamente a propriedade, ex: 'fire', 'grass'. 
  const normal = '#F5F5F5'
  return {
    normal,
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    ice: '#DEF3FD',
    water: '#DEF3FD',
    ground: '#F4E7DA',
    rock: '#D5D5D4',
    fairy: '#FCEAFF',
    poison: '#98D7A5',
    bug: '#F8D5A3',
    ghost: '#CAC0F7',
    dragon: '#97B3E6',
    psychic: '#EAEDA1',
    fighting: '#E6E0D4'
  }[type] || normal
  // he square bracket notation [type] is used to dynamically access the property based on the value of type. For example, if type is 'fire', it will return '#FDDFDF'.
}
// const x = 'fire'
// console.log(getTypeColor(x)) passando uma variavel como um argumento
// console.log(getTypeColor('acb')) passando um argumento que não existe valor correspondente dentro do objeto.


// 1. ETAPA
// A primeira coisa que precisamos fazer é rederizar a página quando o usuário entra nela e buscar os Pokemons
// 1.1 Buscar os pokemon
// 1.2 Buscar a propriedade TIPO dentro da array que results retornou e as imagens
    //precisamos executar o request para cada URL da propriedade URL.
    // 1.2.1 Tenho um array de objetos e preciso de um array só com as URL para fazer um request e obter o tipo de cada pokemon.
    // 1.2.2 Precisa obter o ID de cada pokemon para combinar com as images de cada um que respectivamente tem o mesmo valor que o ID.
    // 1.2.3 Obtendo as imgs de cada pokemon dentro de uma array de urls.
// 1.3 Criando o array que armazena tudo
// 1.4 Rederizar na tela os dados obtidos e armazenados na array
// 1.4.1 Selecionar o container
// 1.4.2 Criar uma <li> para cada pokemon
// 1.4.3 Colocar cada valor de cada propriedade dentro de cada <li>
// 1.4.4 Se cria para cada <li> uma tag <img> um <h2> e um <p>
// 1.4.5 Se seta o os atributos
// 1.5 Sanitizar informações quando se alimenta de APIs
// 1.5.1 Usar libs como DOMpurify para sanitizar e evitar que algum código malicioso seja exetuado caso a fonte seja atacada. será usado CDN
// 1.5.2 Identificar as strings que estão vindo da PokeAPI e devem ser sanitizadas e colocar DOMpurify.sanitize(string)
// 1.6 Conteúdo escrito que será exibido na tela
// 1.7 Iserindo o <li> com todos os conteúdos na ul DE UMA SÓ VEZ. Evitando que o DOM seja manipulado todas as vezes para cada forEach, pois ele vai redesenhar e refluxo(reflow repend)
// 1.7.1 Precisamos usar então um fragmento de documento, ele é um nó do DOM ou seja um container vazio que só existe em memória. vamos inserir os nós do dom no fragmet
// 1.8 Vamos renderizar os próximos 15 Pokemons quando a barra estiver próximo ao fim da tela
// 1.8.1 Vamos colocar um observador (IntersectionObserver) no último pokemon renderizado e quando a tela estiver mostrando os primeiros pixels do pokemon ele vai renderizar os proximos
// 1.8.1 Em seguida precisamos desobservar o último para que o comportamento não se repita
// 1.9 Obter os próximos 15 pokemons
// 1.9.1 Renderizar os próximos 15 pokemons
// 2.0 Ao chegar ao final do ultimo pokemon(30) tempos que colocar um observer no último para renderizar os próximos 15 pokemons
// 2.0.1 Abstrarir o código(colocar em uma função) que coloca o observer no último pokemon. para que a cada vez que a barra de rolagem for pro final o bloco precisa ser executado
// 2.0.1 Incrementar o offset de 15 em 15 de forma dinâmica
// 2.0.2 Impedir que a getPokemons busque pokemons > 150
// 2.1 Mutação exposta, offset pode ser modificado em qualquer lugar. Precisamos isolar a mutação. Enclusauramento e encapsulamento
// 3.0 Melhoramentos
// 3.1 remover o at e usar a notação de colchetes para obter a notação
// 3.2 Obter os próximos antes de chegar ao final para dar tempo de carregar aumentando a margin.



const getPokemonsType = async (pokeApiResults) => { //tá sendo usado pokeApiResults ou seja, preciso passá-la como parametro da funcion
  // A expressão retorna um ARRAY DE PROMISES
  const promises = pokeApiResults.map(result => fetch(result.url)) // retorno Array(15) [ Promise { "pending" },...]
  // ESPERAR TODAS A PROMISES serem resolvidas e vamos fazer isso em paralelo como o método allSettled. Pode ocorrer de não retornar estodo fulfilled e retornar REJECTED
  const responses = await Promise.allSettled(promises) //vai esperar todas as promises serem resolvidas e faz ter o resultado final mais eficiente e vai RETORNAR um promise
  // Só vai pegar as promises com status fulfilled. Usando o método filter() que recebe response como parametro da função de callback 
  const fulfilled = responses.filter(response => response.status === 'fulfilled')
  const pokePromises = fulfilled.map(url => url.value.json()) // esse callback vai retornar url.value.json que é uma array PROMISES
  const pokemons = await  Promise.all(pokePromises) // retorna um array com os primeiros 15 pokemons Array(15) [ {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, … ]
  // 1.2.2 Obtendo o array de arrays que facilitara o acesso ao tipo de cada pokemon
  // pokemons.map vai mapear as propriedades de cada objeto do array e depois vai pegar a propriedade types de cada objeto que armazena outro array de objetos
  // então queremos obter um array com a mesma quantidade do array percorreremos cada propriedade types com um map ena função de callback do map receberemos 
  // como parâmetro cada objeto que chamaremos de info e cada info contém type e cada typy contem name.
  return pokemons.map(fulfilled => fulfilled.types.map(info => DOMPurify.sanitize(info.type.name))) // retorna [ (2) […], (2) […], (2) […], (1) […], (1) […], (2) […], (1) […], (1) […], (1) […], (1) […], … ]
}
 // 1.2.2 Obtendo os IDs do pokemons
  // O map vai receber cada objeto do array
const getPokemonsIds = (pokeApiResults) => pokeApiResults.map(({url}) => {
    const urlAsArray = DOMPurify.sanitize(url).split('/')
    return urlAsArray[urlAsArray.length - 2] // return Array(15) [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", … ]
  })

const getPokemonsImgs = async (ids) => {
  const promises = ids.map(id => fetch(`./assets/img/${id}.png`))
  const responses = await Promise.allSettled(promises)
  const fulfilled = responses.filter(response => response.status === 'fulfilled')
  return fulfilled.map(response => response.value.url) // return Array(15) [ "http://127.0.0.1:5500/assets/img/1.png",...]

}

//2.1 Encapsulamento do X pois não é acessível diretamente fora da função.
// Esse padrão de projeto se chama singleton
const paginationInfo = (() => { // Isso é uma IIFE ou seja uma função autoexecutável (() => {})() ela retorna na propria declaração da const
  // Não consigo acessar de fora a let x, a não ser que retorne um método que será retornado e que au ser chamado irá realizar a mutação
  // let x = 1
  //2.0.1 Incrementar o offset de 15 em 15 de forma dinâmica
  const limit = 15
  let offset = 0

  const getOffset = () => offset
  const getLimit = () => limit
  const incrementOffset = () => offset += limit


  return {getOffset, getLimit, incrementOffset}
})()



const getPokemons = async () => { // () era vazio, agora solução 1.9 (url) 2.0 agora vazio
// Quando usa await precisa usar uma função async.
  //  Try...catch usado pra que se algo der errado no request o erro não trava a aplicação.
  try {
    //2.0.2 Aplicando o encapsulamento
    const {getOffset, getLimit, incrementOffset} = paginationInfo
    // tentar fazer um REQUEST para a API dos pokemons, vai fazer um  REQUEST para a URL específica
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${getLimit()}&offset=${getOffset()}`) // () era a própria url da API, agora solução 1.9 (url) // 2.0 agora URL com interpolação // 2.0.2 aplicando o encapsulamento

    if (!response.ok) {
      // checa se reponse não está ok. se não está ok lança um erro
      throw new Error('Não foi possível obter as infos.')
    }
    // como se tivesse um else aqui... porque cai fora da do bloco else e executa esse console.log e etc.
    // 1.1.1 pegar o JSON dentro da constante RESPONSE e converter em OBJETO JavaScript.
    // está declarando uma const e um descructuring para desestruturar a PROPRIEDADE RESULTS do OBJETO renomeando ela.
    // método JSON retorna uma PROMISE por isso precisa do await para aguardar a PROMISE ser resolvida.
    const { results: pokeApiResults } = await response.json()
    // 1.2.1 Encadeia na pokeApiResults a invocação de um MAP que recebe um parâmetro que se chamara result e executa um REQUEST para cada expressão URL.
    // como essa chamada de getPokemonsType que é uma função async vai ser uma promise então preciso aguardar ela resolver e guardar em um const.
    
    const types = await getPokemonsType(pokeApiResults)
    const ids = getPokemonsIds(pokeApiResults)
    const imgs = await getPokemonsImgs(ids)
    // 1.3 Criando o array que armazena tudo
    // usando o array ids invoca um map a funcao de callback vai ter um parametro id e index, a funcao vai retornar um objeto,
    // o objeto vai ter uma propriedade id que recebe id; propriedade name que recebe pokeApiResults pra cada indice pega o nome; a propriedade types que recebe
    // types para cada indice de i e a propriedade imgUrl que recebe cada url das imagens para cada indice.
    const pokemons = ids.map((id, i) => ({ id: id, name: pokeApiResults[i].name, types: types[i], imgUrl: imgs[i] }))// retunr Array(15) [ Object { id: "1", name: "bulbasaur", imgUrl: "http://127.0.0.1:5500/assets/img/1.png", … }, … ]
    
    //2.0.1 Incrementar o offset de 15 em 15 de forma dinâmica
    // offset += limit

    incrementOffset()
    return pokemons  //retornava status: 200, ok: true... antes da const acima ser declarada. Após //retorna Array(15) [ {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, … ]
  } catch (error) {
    console.log(`Algo deu errado:`, error);
  }
}

const renderPokemons = (pokemons) => {
  const ul = document.querySelector('[data-js="pokemons-list"]')
  const fragment = document.createDocumentFragment()

  pokemons.forEach(({id, name, types, imgUrl}) => {
    const li = document.createElement('li')
    const img = document.createElement('img')
    const nameContainer = document.createElement('h2')
    const typeContainer = document.createElement('p')
    const [firstType] = types // pega a array types que tem apenas dois elementos e faz um DESTRUCTURING de array definindo um variavel apenas para o primeiro valor

    img.setAttribute('src', imgUrl)
    img.setAttribute('alt', name)
    img.setAttribute('class', 'card-image')
    li.setAttribute('class', `card ${firstType}`)
    li.style.setProperty('--type-color', getTypeColor(firstType))

    nameContainer.textContent = `${id}. ${name[0].toUpperCase()}${name.slice(1)}`
    typeContainer.textContent = types.length > 1 ? types.join(' | ') : firstType
    li.append(img, nameContainer, typeContainer)

    fragment.append(li)
  })

  ul.append(fragment)
}

// 2.0.1 Abstrarir o código(colocar em uma função) que coloca o observer no último pokemon.
const observeLastPokemon = (pokemonsOberver) => { // Essa função está recebendo a constante pokemonObserver então ela precisa recebe-la como parametro
  const lastPokemon = document.querySelector('[data-js="pokemons-list"]').lastChild
  pokemonsOberver.observe(lastPokemon)
}


const handleNextPokemonsRender = () => {
  //observer (o segundo elemento) é um parametro que armazena o próprio observer que tá armazenado
  const pokemonsOberver = new IntersectionObserver(async (elements, observer) => { //nessa função que vai executar a ação que vai acontecer quando o elemento for mostrado na tela.
    if (!elements[0].isIntersecting) { //isIntersecting é quando ele cruza a tela. se ele não estiver cruzando a tela nada é realizado.
      return
    }
    // Código é executado quando o if for truthy
    //1.8.1 Desobservando o elemento
    observer.unobserve(elements[0].target)
    // 2.0.2 Impedindo que getPokemons receba > 150.
    if (paginationInfo.getOffset() === 150) {
      return
    }

    const pokemons = await getPokemons() // () era a vazio, agora solução 1.9 (url da API com o offset=15) 2.0 agora vazio
    renderPokemons(pokemons)
  // 2.0   
    observeLastPokemon(pokemonsOberver)
  }, { rootMargin: '500px'}) // 3.2 Obter os próximos antes de chegar ao final para dar tempo de carregar aumentando a margin.
  // IntersectionObserver pode receber um segundo parametro que é um objeto que tem uma propriedade chamada rootMargin
  
  observeLastPokemon(pokemonsOberver)

}

const handlePageLoaded = async () => {
  const pokemons = await getPokemons() // () era a vazio, agora solução 1.9 (url da API) 2.0 agora vazio
  renderPokemons(pokemons)
  handleNextPokemonsRender ()
}

handlePageLoaded()