let privilegedCustomerRules = [
  {
    _id: 3, name: 'Infosys', rules: [
      {count: 3, discount: "269.99", size: 10, type: 'pizza'}
    ]
  },
  {
    _id: 2, name: "Amezon", rules: [
      {count: 1, discount: "23", size: 15, type: 'pizza'},
      // {count: 2, discount: "23%", size: 12, type: 'pizza'}
    ]
  },
  {
    _id: 1, name: "Facebook", rules: [
      {count: 5, discount: "394.99", size: 10, type: 'pizza'},
      {count: 1, discount: "5", size: 12, type: 'pizza'}
    ]
  },
];

let items = [
  {_id: 1, name: "Small Pizza", size: 10, type: "pizza", retailPrice: 269.99},
  {_id: 2, name: "Medium Pizza", size: 12, type: "pizza", retailPrice: 322.99},
  {_id: 3, name: "Large Pizza", size: 15, type: "pizza", retailPrice: 394.99}
];


const Checkout = function () {
  return {
    privilegedCustomerId: '',
    orders: [],
    privilegedCustomer: {},
    sumOfRetailPrice: 0,
    totalDiscountedPrice: 0,
    orderCountEnum: {},

    getCustomer: function (privilegedCustomerId) {
      this.privilegedCustomerId = privilegedCustomerId;
    },

    validateOrder: function (size, type) {
      return !size || !type;

    },

    getOrder: function (size, type) {
      if (this.validateOrder(size, type)) {
        return;
      }
      this.orders.push({size, type});
    },

    getRetailPrice: function () {
      this.orders.forEach(order => {
        order.retailPrice = items.find(item => (item.size + item.type) === (order.size + order.type)).retailPrice;
      });
    },

    getRule: function () {
      this.privilegedCustomer = privilegedCustomerRules.find(rule => rule._id === this.privilegedCustomerId) || {};
    },

    findSumOfRetailPrice: function () {
      this.sumOfRetailPrice = this.orders.reduce(
        (accumulator, currentValue) => accumulator + currentValue.retailPrice
        , 0
      )
    },

    makeItemCount: function () {
      this.orders.forEach(order => {
        if (this.orderCountEnum.hasOwnProperty(order.size + order.type)) {
          this.orderCountEnum[order.size + order.type] = this.orderCountEnum[order.size + order.type] + 1;
        } else {
          this.orderCountEnum[order.size + order.type] = 1;
        }
      });
    },

    getDiscountedPrice: function () {
      this.totalDiscountedPrice = this.sumOfRetailPrice;
      if (this.privilegedCustomer.rules && this.privilegedCustomer.rules.length) {
        this.privilegedCustomer.rules.forEach(rule => {
          if (this.orderCountEnum.hasOwnProperty(rule.size + rule.type) && parseInt(this.orderCountEnum[rule.size + rule.type] / rule.count)) {
            this.totalDiscountedPrice = this.totalDiscountedPrice - (rule.discount * parseInt(this.orderCountEnum[rule.size + rule.type] / rule.count));
          }
        });
      }
      return this.totalDiscountedPrice;
    }
  }
}


const co = new Checkout();


co.getCustomer(3);


co.getOrder(10, 'pizza');
co.getOrder(10, 'pizza');
co.getOrder(15, 'pizza');
co.getOrder(10, 'pizza');
co.getOrder(10, 'pizza');


co.getRetailPrice();
co.getRule();
co.findSumOfRetailPrice();
co.makeItemCount();


const total = co.getDiscountedPrice();
console.log(" Total : ", total);