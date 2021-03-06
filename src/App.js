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

class EditForm extends Component {
  constructor(props) {
    super(props);
    this.form = React.createRef();
    this.prn = props.prn;
    this.prn.form = this;
    this.row = null;
    this.state = {
      name: "",
      price: 0,
      ammount: 0,
      nameError: {state: false, text: ""},
      priceError: {state: false, text: ""},
      ammountError: {state: false, text: ""},
    }
  }

  load(row) {
    this.row = row;
    if(row !== null) {
      this.setState({
        name: row.name,
        price: row.price,
        ammount: row.ammount
      });
    }
    else {
      this.setState({
        name: "new item",
        price: 0,
        ammount: 0
      });
    }
  }

  action = (mode) => {
    console.log(this.form);
    let name = this.form.current.name.value;
    let price = parseFloat(this.form.current.price.value);
    let ammount = parseFloat(this.form.current.ammount.value);
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
    if(!error) {
      if(this.row === null) {
        this.prn.add(name, price, ammount);
      }
      else {
        if(mode === "add") {
          this.prn.add(name, price, ammount);
        }
        else {
          this.row.name = name;
          this.row.price = price;
          this.row.ammount = ammount;
        }
      }
    }
  }

  onNameChanged = (e) => {
    this.setState({name: e.target.value})
  }

  onPriceChanged = (e) => {
    this.setState({price: e.target.value})
  }

  onAmmountChanged = (e) => {
    this.setState({ammount: e.target.value})
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
          <EditForm.Error state={this.state.nameError}/>
        </div>
        <div className="input">
          <input className="value" name="name" type="text" value={this.state.name} onChange={this.onNameChanged}/>
        </div>
        <div className="title">
          <div>price:</div>
          <EditForm.Error state={this.state.priceError}/>
        </div>
        <div className="input">
          <input className="value" name="price" type="number" value={this.state.price} onChange={this.onPriceChanged}/>
        </div>
        <div className="title">
          <div>ammount:</div>
          <EditForm.Error state={this.state.ammountError}/>
        </div>
        <div className="input">
          <input className="value" name="ammount" type="number" value={this.state.ammount} onChange={this.onAmmountChanged}/>
        </div>
        <div className="button">
          <input className="button" type="button" value="Save" onClick={()=>this.action("save")}/>
          <input className="button" type="button" value="Add new item" onClick={()=>this.action("add")}/>
        </div>
      </form>
    );
  }
}

class Row extends Component {
  constructor(props) {
    super(props);
    this.prn = props.prn;
    this.state = {
      id: props.item.id,
      name: props.item.name,
      price: props.item.price,
      ammount: props.item.ammount,
      cost: props.item.price * props.item.ammount,
      active: false
    }
    this.prn.setRow(this);
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

  onClick = (e) => {
    this.prn.selected(this.id, e);
  }

  onDelete = (e) => { this.prn.del(this.id); e.stopPropagation();}

  get id() {return this.state.id;}

  set active(value) { this.setState({ active: value});}
  get active() {return this.state.active;}

  set name(value) { this.setState({ name: value});}
  get name() {return this.state.name;}

  set price(value) { 
    if(typeof value === "number" && value>0) {
      this.setState({ price: value, cost: this.state.ammount * value});
    }
  }
  get price() {return this.state.price;}

  set ammount(value) {
    if(typeof value === "number" && value>=0) {
      this.setState({ ammount: value, cost: this.state.price * value});
    }
  }
  get ammount() {return this.state.ammount;}

  get cost() {return this.state.cost;}

  render() {
    return (
      <div className={`row ${this.state.active && "active"}`} onClick={(e)=>this.onClick(e)}>
        <div className="id">{this.state.id}</div>
        <Row.Name value={this.state.name}/>
        <Row.Price value={this.state.price}/>
        <Row.Ammount value={this.state.ammount}/>
        <Row.Cost value={this.state.cost}/>
        <div className="delete"><img src="/del.svg" onClick={this.onDelete}></img></div>
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
    this.rows = new Map();
    this.sel = null;
    this.sort = {
      id: false,
      name: false,
      price: false,
      ammount: false,
      cost: false
    }
    this.state = {
      goods: props.goods
    }
    for(let t of this.state.goods) if(t.id>this.ID) this.ID = t.id;
  }

  add(name, price, ammount) {
    console.log(`Table Adding: ${name} ${price} ${ammount}`);
    let t = {
      id: ++this.ID,
      name: name,
      price: parseFloat(price),
      ammount: parseFloat(ammount)
    };
    this.state.goods.push(t);
    this.setState({goods: this.state.goods});
  }

  del(id) {
    if(this.rows.get(id)) {
      this.rows.delete(id);
      let i = this.state.goods.findIndex(item => item.id === id);
      this.state.goods.splice(i,1);
      this.setState({goods: this.state.goods});
    }
  }

  selected(id, e) {
    let row = this.rows.get(id);
    if(row !== undefined) {
      if(this.sel != row) {
        if(this.sel != null) {
          this.sel.active = false;
        }
        this.sel = row;
        row.active = true;
      }
      else {
        this.sel = null;
        row.active = false;
      }
      this.prn.selected(this.sel);
    }    
  }

  setRow(row) {
    this.rows.set(row.id, row);
  }

  sortByID = () => {
    if(this.sort.id) this.state.goods.sort((a,b) => a.id - b.id);
    else this.state.goods.sort((a,b) => b.id - a.id);
    this.sort.id = !this.sort.id;
    this.setState({goods: this.state.goods});
  }

  sortByName = () => {
    console.log("sort by name");
    if(this.sort.name) {
      this.state.goods.sort((a,b) => {
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
      });
    }
    else {
      this.state.goods.sort((a,b) => {
        if(a.name < b.name) return 1;
        if(a.name > b.name) return -1;
        return 0;
      });
    }
    this.sort.name = !this.sort.name;
    this.setState({goods: this.state.goods});
  }

  sortByPrice = () => {
    console.log("sort by price");
    if(this.sort.price) this.state.goods.sort((a,b) => a.price - b.price);
    else this.state.goods.sort((a,b) => b.price - a.price);
    this.sort.price = !this.sort.price;
    this.setState({goods: this.state.goods});
  }

  sortByAmmount = () => {
    console.log("sort by ammount");
    if(this.sort.ammount) this.state.goods.sort((a,b) => a.ammount - b.ammount);
    else this.state.goods.sort((a,b) => b.ammount - a.ammount);
    this.sort.ammount = !this.sort.ammount;
    this.setState({goods: this.state.goods});
  }

  sortByCost = () => {
    console.log("sort by cost");
    if(this.sort.cost) this.state.goods.sort((a,b) => a.price*a.ammount - b.price*b.ammount);
    else this.state.goods.sort((a,b) => b.price*b.ammount - a.price*a.ammount);
    this.sort.cost = !this.sort.cost;
    this.setState({goods: this.state.goods});
  }

  render() {
    return (
      <div className="table">
        <div className="header">
          <div onClick={this.sortByID}>№</div>
          <div onClick={this.sortByName}>Name</div>
          <div onClick={this.sortByPrice}>Price</div>
          <div onClick={this.sortByAmmount}>Ammount</div>
          <div onClick={this.sortByCost}>Cost</div>
          <div></div>
        </div>
        <div className="body">
          {this.state.goods.map((item) => {return <Row key={item.id} item={item} prn={this}/>;})}
        </div>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this._table = null;
    this._form = null;
  }

  add = (name, price, ammount) => {
    console.log(`Adding: ${name} ${price} ${ammount}`);
    this._table.add(name, price, ammount);
  }

  selected(row) {
    this._form.load(row);
  }

  set table(value) {this._table = value;}
  set form(value) {this._form = value;}

  render() {
    return (
      <div className="App">
        <h1>List of goods</h1>
        <EditForm prn={this} />
        <Table goods={theGoods} prn={this}/>
      </div>
    );
  }
}

export default App;
