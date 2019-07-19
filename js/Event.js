var OregonH = OregonH || {};

class EventType {
  constructor(type, notification, text) {
    this.type = type
    this.notification = notification
    this.text = text
  }
}

class StatChange extends EventType {
  constructor(type, notification, text, value, stat) {
    super(type, notification, text)
    this.value = value
    this.stat = stat
  }
} 

class ShopEvent extends EventType {
  constructor(type, notification, text, products) {
    super(type, notification, text)
    this.products = products
  }
}
 
OregonH.Event = {};

OregonH.Event.eventTypes = [];
// -----------------------------

function makeEvent(obj) {
  // obj = { type:'ATTACK', value:7, stat:'crew' }
  // Deconstruct obj into variables from it's properties
  const { type, notification, text, value, products, stat } = obj // {type, value, stat}
  console.log(type, notification, text, value, products, stat)
  switch(obj.type) {
    case 'ATTACK':
      return new EventType(type, notification, text)
    case 'STAT-CHANGE': 
      return new StatChange(type, notification, text, value, stat)
    case 'SHOP':
      return new ShopEvent(type, notification, text, products)
    default: 
      return {} // Handle 
  }
}
// ----------------------------
for (let i = 0; i < data.length; i += 1) {
  const obj = data[i]
  const event = makeEvent(obj)
  OregonH.Event.eventTypes.push(event)
}
 
OregonH.Event.generateEvent = function(){
  //pick random one
  var eventIndex = Math.floor(Math.random() * this.eventTypes.length);
  var eventData = this.eventTypes[eventIndex];
 
  //events that consist in updating a stat
  if(eventData.type == 'STAT-CHANGE') {
    this.stateChangeEvent(eventData);
  }
 
  //shops
  else if(eventData.type == 'SHOP') {
    //pause game
    this.game.pauseJourney();
 
    //notify user
    this.ui.notify(eventData.text, eventData.notification);
 
    //prepare event
    this.shopEvent(eventData);
  }
 
  //attacks
  else if(eventData.type == 'ATTACK') {
    //pause game
    this.game.pauseJourney();
 
    //notify user
    this.ui.notify(eventData.text, eventData.notification);
 
    //prepare event
    this.attackEvent(eventData);
  }
};
 
OregonH.Event.stateChangeEvent = function(eventData) {
  //can't have negative quantities
  if(eventData.value + this.caravan[eventData.stat] >= 0) {
    this.caravan[eventData.stat] += eventData.value;
    this.ui.notify(eventData.text + Math.abs(eventData.value), eventData.notification);
  }
};
 
OregonH.Event.shopEvent = function(eventData) {
  //number of products for sale
  var numProds = Math.ceil(Math.random() * 4);
 
  //product list
  var products = [];
  var j, priceFactor;
 
  for(var i = 0; i < numProds; i++) {
    //random product
    j = Math.floor(Math.random() * eventData.products.length);
 
    //multiply price by random factor +-30%
    priceFactor = 0.7 + 0.6 * Math.random();
 
    products.push({
      item: eventData.products[j].item,
      qty: eventData.products[j].qty,
      price: Math.round(eventData.products[j].price * priceFactor)
    });
  }
 
  this.ui.showShop(products);
};
 
//prepare an attack event
OregonH.Event.attackEvent = function(eventData){
  var firepower = Math.round((0.7 + 0.6 * Math.random()) * OregonH.ENEMY_FIREPOWER_AVG);
  var gold = Math.round((0.7 + 0.6 * Math.random()) * OregonH.ENEMY_GOLD_AVG);
 
  this.ui.showAttack(firepower, gold);
};