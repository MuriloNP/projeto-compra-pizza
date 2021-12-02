let cart = [];
let modalKey = null;
let modalQt = 1;

/* Função das query */
const query = element => document.querySelector(element);
const queryAll = elements => document.querySelectorAll(elements);

/* Listagem das pizzas */
pizzaJson.map((element, index) => {
  //Preenche as informações em pizzaElement
  const pizzaElement = query('.models .pizza-item').cloneNode(true);

  pizzaElement.setAttribute('data-key', index);
  pizzaElement.querySelector('.pizza-item--img img').src = element.img;
  pizzaElement.querySelector(
    '.pizza-item--price'
  ).innerHTML = `R$ ${element.price.toFixed(2).replace('.', ',')}`;
  pizzaElement.querySelector('.pizza-item--name').innerHTML = element.name;
  pizzaElement.querySelector('.pizza-item--desc').innerHTML =
    element.description;

  /* Evento clique para abrir o modal das pizzas */
  pizzaElement.querySelector('a').addEventListener('click', event => {
    event.preventDefault();

    /* Procura a classe('.pizza-item') mais proxima do elemento('a'), e pega seu atributo(no caso o data-key) */
    const key = event.target.closest('.pizza-item').getAttribute('data-key');

    modalQt = 1;
    modalKey = key;

    query('.pizzaBig img').src = pizzaJson[key].img;
    query('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    query('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    query('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price
      .toFixed(2)
      .replace('.', ',')}`;
    query('.pizzaInfo--size.selected').classList.remove('selected');

    /* Percorre todos os elementos com a classe: .pizzaInfo--size */
    queryAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
      if (sizeIndex === 2) size.classList.add('selected');
      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    query('.pizzaInfo--qt').innerHTML = modalQt;

    query('.pizzaWindowArea').style.opacity = 0;
    query('.pizzaWindowArea').style.display = 'flex';

    setTimeout(() => {
      query('.pizzaWindowArea').style.opacity = 1;
    }, 200);
  });

  query('.pizza-area').append(pizzaElement);
});

/* Eventos do modal */
const closeModal = () => {
  query('.pizzaWindowArea').style.opacity = 0;
  setTimeout(() => {
    query('.pizzaWindowArea').style.display = 'none';
  }, 500);
};

const eventClickClose = () => {
  queryAll(
    `.pizzaInfo--addButton, 
    .pizzaInfo--cancelButton, 
    .pizzaInfo--cancelMobileButton`
  ).forEach(elementItem => {
    elementItem.addEventListener('click', closeModal);
  });
};

queryAll('.pizzaInfo--size').forEach(size => {
  size.addEventListener('click', () => {
    query('.pizzaInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
  });
});

/* Evento do botão qtmenos */
query('.pizzaInfo--qtmenos').addEventListener('click', () => {
  if (modalQt > 1) {
    modalQt--;
    query('.pizzaInfo--qt').innerHTML = modalQt;
  }
});

/* Evento do botão qtmais */
query('.pizzaInfo--qtmais').addEventListener('click', e => {
  modalQt++;
  query('.pizzaInfo--qt').innerHTML = modalQt;
});

/* Evento do botão adicionar ao carrinho*/
query('.pizzaInfo--addButton').addEventListener('click', () => {
  let size = parseInt(
    query('.pizzaInfo--size.selected').getAttribute('data-key')
  );

  let identifier = `${pizzaJson[modalKey].id}@${size}`;

  /* Retorne os identificadores com o mesmo identificador, se não, ele retornará -1 */
  let identifierKey = cart.findIndex(
    element => element.identifier === identifier
  );

  if (identifierKey > -1) {
    cart[identifierKey].qt += modalQt;
    console.log(cart);
  } else {
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQt
    });
    console.log(cart);
  }
  updateCart();
});

/* Evento que abre o  carrinho mobile */
query('.menu-openner').addEventListener('click', () => {
  if (cart.length > 0) query('aside').style.left = '0';
});

/* Evento que fecha o carrinho */
query('.menu-closer').addEventListener(
  'click',
  () => (query('aside').style.left = '100vw')
);

/* Atualiza o carrinho */
const updateCart = () => {
  query('.menu-openner span').innerHTML = cart.length;
  if (cart.length > 0) {
    query('aside').classList.add('show');
    query('.cart').innerHTML = '';

    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for (const index in cart) {
      let pizzaItem = pizzaJson.find(
        elementItem => elementItem.id === cart[index].id
      );

      subtotal += pizzaItem.price * cart[index].qt;

      let cartItem = query('.models .cart--item').cloneNode(true);
      let pizzaSizeName;

      switch (cart[index].size) {
        case 0:
          pizzaSizeName = 'P';
          break;
        case 1:
          pizzaSizeName = 'M';
          break;
        case 2:
          pizzaSizeName = 'G';
          break;
        default:
          alert('Tamanho invalido');
          break;
      }

      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

      cartItem.querySelector('img').src = pizzaItem.img;
      cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[index].qt;

      cartItem
        .querySelector('.cart--item-qtmais')
        .addEventListener('click', () => {
          cart[index].qt++;
          updateCart();
        });

      cartItem
        .querySelector('.cart--item-qtmenos')
        .addEventListener('click', () => {
          if (cart[index].qt > 1) {
            cart[index].qt--;
          } else {
            cart.splice(index, 1);
          }
          updateCart();
        });

      query('.cart').append(cartItem);
    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    query('.subtotal span:last-child').innerHTML = `R$ ${subtotal
      .toFixed(2)
      .replace('.', ',')}`;
    query('.desconto span:last-child').innerHTML = `R$ ${desconto
      .toFixed(2)
      .replace('.', ',')}`;
    query('.total span:last-child').innerHTML = `R$ ${total
      .toFixed(2)
      .replace('.', ',')}`;
  } else {
    query('aside').classList.remove('show');
    query('aside').style.left = '100vw';
  }
};

/* Evento de fechar o modal */
eventClickClose();
