import React, {Component} from 'react';
import './App.css';

const theGoods = [
  {
    id: 1,
    name: "apple",
    price: 12.34,
    ammount: 12
  },
  {
    id: 2,
    name: "plum",
    price: 34.76,
    ammount: 10.23
  },
  {
    id: 3,
    name: "nut",
    price: 1.4,
    ammount: 135
  },
  {
    id: 4,
    name: "chery",
    price: 18.23,
    ammount: 145.97
  },
  {
    id: 5,
    name: "onion",
    price: 0.14,
    ammount: 78.2
  },
];

class NewItem extends Component {
  constructor(props) {
    super(props);
    this.form = React.createRef();
    this.state = {
      name: props.name,
      price: parseFloat(props.price),
      ammount: parseFloat(props.ammount),
      nameError: {state: false, text: ""},
      priceError: {state: false, text: ""},
      ammountError: {state: false, text: ""},
    }
  }

  add = () => {
    console.log(this.form);
    let name = this.form.current.name.value;
    let price = this.form.current.price.value;
    let ammount = this.form.current.ammount.value;
    let error = false;
    if(price<=0) {
      error = true;
      this.setState({
        priceError: {state: true, text: "price must be > 0"}
      });
    }
    else {
      this.setState({
        priceError: {state: false, text: ""}
      });
    }
    if(ammount<0) {
      error = true;
      this.setState({
        ammountError: {state: true, text: "amount must be >= 0"}
      });
    }
    else {
      this.setState({
        ammountError: {state: false, text: ""}
      });
    }
    if(!error) this.props.add(name, price, ammount);
  }

  static Error(props) {
    return (
      <div className={`error ${props.state && "active"}`}>{props.state.text}</div>
    );
  }

  render() {
    return (
      <form className="formAddItem" ref={this.form}>
        <div className="title">
          <div>name:</div>
          <NewItem.Error state={this.state.nameError}/>
        </div>
        <div className="input">
          <input className="value" name="name" type="text"/>
        </div>
        <div className="title">
          <div>price:</div>
          <NewItem.Error state={this.state.priceError}/>
        </div>
        <div className="input">
          <input className="value" name="price" type="number"/>
        </div>
        <div className="title">
          <div>amount:</div>
          <NewItem.Error state={this.state.ammountError}/>
        </div>
        <div className="input">
          <input className="value" name="ammount" type="number"/>
        </div>
        <div className="input">
          <input className="button" type="button" value="add new item" onClick={this.add}/>
        </div>
      </form>
    );
  }
}

class Row extends Component {
  constructor(props) {
    super(props);

  }

  static Name(props) {
    return (
      <div className="name">{props.value}</div>
    );
  }

  static Price(props) {
    return (
      <div className="price">{props.value.toFixed(2)}</div>
    );
  }

  static Ammount(props) {
    return (
      <div className="ammount">{props.value.toFixed(2)}</div>
    );
  }

  static Cost(props) {
    return (
      <div className="cost">{props.value.toFixed(2)}</div>
    );
  }

  render() {
    return (
      <div className="row">
        <div className="id">{this.props.item.id}</div>
        <Row.Name value={this.props.item.name}/>
        <Row.Price value={this.props.item.price}/>
        <Row.Ammount value={this.props.item.ammount}/>
        <Row.Cost value={this.props.item.price * this.props.item.ammount}/>
      </div>
    );
  }
}

class Table extends Component {
  constructor(props) {
    super(props);
    this.prn = props.prn;
    this.prn.table = this;
    this.ID = 0;
    this.goods = props.goods;
    for(let t of this.goods) if(t.id>this.ID) this.ID = t.id;
  }

  add(name, price, ammount) {
    console.log(`Table Adding: ${name} ${price} ${ammount}`);
    let t = {
      id: ++this.ID,
      name: name,
      price: parseFloat(price),
      ammount: parseFloat(ammount)
    };
    this.goods.push(t);
    this.setState({});
  }

  render() {
    return (
      <div className="table">
        {this.goods.map((item) => {return <Row key={item.id} item={item}/>;})}
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this._table = null;
  }

  add = (name, price, ammount) => {
    console.log(`Adding: ${name} ${price} ${ammount}`);
    this._table.add(name, price, ammount);
  }

  set table(value) {this._table = value;}

  render() {
    return (
      <div className="App">
        <h1>List of goods</h1>
        <NewItem add={this.add} name="new item" price="0.00" ammount="0.00"/>
        <Table goods={theGoods} prn={this}/>
      </div>
    );
  }
}

export default App;
