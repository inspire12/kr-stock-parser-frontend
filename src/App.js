import React from 'react';
/* 
  Row component written as a simple function:
  https://facebook.github.io/react/docs/components-and-props.html#functional-and-class-components
  
  Any components that do not have state should be written this way,
  see: https://medium.com/@housecor/react-stateless-functional-components-nine-wins-you-might-have-overlooked-997b0d933dbc
*/

const Row = ({stock_id, stock_name, market_capitalization,per, dividend_rate, roe_list}) => {
  
  return (<div className="row">
    <div><a target="_blank" href={"https://finance.naver.com/item/main.nhn?code="+stock_id} >{stock_name}</a></div>
    <div>{market_capitalization}</div>    
    <div>{per}</div>
    <div>{dividend_rate}</div>    
    {/* <div>{roe_list}</div>     */}
  </div>)
};

/*
  Table component written as an ES6 class
*/
class Table extends React.Component {
  componentDidMount(){
    fetch ("http://localhost:5000/rows", {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin':'*'
      }
    })
    .then(res => res.json())
    .then(result => {
      console.dir(result)
      this.setState(prevState => {
        let data = Object.assign({}, prevState.data);  // creating copy of state variable jasper
        data = result;
        return { data };                                 // return new object jasper object
      })
    })
  }
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {stock_id: 403, stock_name: 'Task 403', market_capitalization: 'High', per: 0.1, dividend_rate: 100, roe_list:[0]}, 
      ],
      keys: {}
    };
   
    
    // http://reactkungfu.com/2015/07/why-and-how-to-bind-methods-in-your-react-component-classes/
    // bind the context for compareBy & sortBy to this component instance
    this.compareBy.bind(this);
    this.sortBy.bind(this);
  }
  
  compareBy(key) {
    if(this.state.keys[key] === 1){
      this.setState(prevState => {
        let keys = Object.assign({}, prevState.keys);  // creating copy of state variable jasper
        keys[key] = -1;                     // update the name property, assign a new value                 
        return { keys };                                 // return new object jasper object
      })
      return function (a, b) {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
      };
    }else{
      this.setState(prevState => {
        let keys = Object.assign({}, prevState.keys);  // creating copy of state variable jasper
        keys[key] = 1;                     // update the name property, assign a new value                 
        return { keys };                                   // return new object jasper object
      })
      return function (a, b) {
        if (a[key] < b[key]) return 1;
        if (a[key] > b[key]) return -1;
        return 0;
      };
    }
  }
 
  sortBy(key) {
    let arrayCopy = [...this.state.data];
    arrayCopy.sort(this.compareBy(key));
    this.setState({data: arrayCopy});
  }
    
  render() {
    const rows = this.state.data.map( (rowData) => <Row {...rowData} />);

    return (
      <div className="table">
        <div className="header">
          <div onClick={() => this.sortBy('stock_id')} >종목</div>
          <div onClick={() => this.sortBy('market_capitalization')}>시가총액</div>
          <div onClick={() => this.sortBy('per')}>PER</div>
          <div onClick={() => this.sortBy('dividend_rate')}>배당금</div>
          
        </div>
        <div className="body">
          {rows}
        </div>
      </div>
    );
    
  }
}


export default Table;