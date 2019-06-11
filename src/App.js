import React from 'react';
import './App.css';
// import './App.scss'
/* 
  Row component written as a simple function:
  https://facebook.github.io/react/docs/components-and-props.html#functional-and-class-components
  
  Any components that do not have state should be written this way,
  see: https://medium.com/@housecor/react-stateless-functional-components-nine-wins-you-might-have-overlooked-997b0d933dbc
*/

const Row = ({stock_id, stock_name, market_capitalization,per, dividend_rate, roe_list, roe_trends}) => {

  return (<tr className="row">
    <td><a target="_blank" href={"https://finance.naver.com/item/main.nhn?code="+stock_id} >{stock_name}</a></td>
    <td>{market_capitalization}</td>    
    <td>{per}</td>
    <td>{dividend_rate}</td>    
    <td>{roe_trends}</td>
  </tr>)
};

/*
  Table component written as an ES6 class
*/
class Table extends React.Component {
  componentDidMount(){
    fetch ("http://localhost:5010/rows", {
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin':'*'
      }
    })
    .then(res => res.json())
    .then(result => {
      console.dir(result)
      this.setState(prevState => {
        console.dir(result)
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
        {stock_id: "001250", stock_name: "GS글로벌", market_capitalization: 2200, per: 25.581, dividend_rate: "0.94", roe_list:[0]}, 
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
 
  // compareByRoe(key){
  //   if(this.state.keys[key] === 1){
  //     this.setState(prevState => {
  //       let keys = Object.assign({}, prevState.keys);  // creating copy of state variable jasper
  //       keys[key] = -1;                     // update the name property, assign a new value                 
  //       return { keys };                                 // return new object jasper object
  //     })
  //     return function (a, b) {
        
  //       let keys = Object.keys(a.roe_list);
  //       let aLatest = a.roe_list[keys[keys.length-1]];
  //       let aSecond = a.roe_list[keys[keys.length-2]];
  //       let bLatest = b.roe_list[keys[keys.length-1]];
  //       let bSecond = b.roe_list[keys[keys.length-2]];
  //       if (aLatest - aSecond < bLatest - bSecond) return -1;
  //       if (aLatest - aSecond < bLatest - bSecond) return 1;
  //       return 0;
  //     };
  //   }else{
  //     this.setState(prevState => {
  //       let keys = Object.assign({}, prevState.keys);  // creating copy of state variable jasper
  //       keys[key] = 1;                     // update the name property, assign a new value                 
  //       return { keys };                                   // return new object jasper object
  //     })
  //     return function (a, b) {
  //       let keys = Object.keys(a.roe_list);
  //       let aLatest = a.roe_list[keys[keys.length-1]];
  //       let aSecond = a.roe_list[keys[keys.length-2]];
  //       let bLatest = b.roe_list[keys[keys.length-1]];
  //       let bSecond = b.roe_list[keys[keys.length-2]];
  //       if (aLatest - aSecond < bLatest - bSecond) return 1;
  //       if (aLatest - aSecond < bLatest - bSecond) return -1;
  //       return 0;
  //     };
  //   }
  // }
  sortBy(key) {
    let arrayCopy = [...this.state.data];
    arrayCopy.sort(this.compareBy(key));
    this.setState({data: arrayCopy});
  }


  // sortByRoe(key, rows) {
  //   let arrayCopy = [...this.state.data];
  //   arrayCopy.sort(this.compareByRoe(key));
  //   this.setState({data: arrayCopy});
  // }
    
  render() {
    const rows = this.state.data.map( (rowData) => <Row {...rowData} />);

    return (
      <table className="table" cellPadding="0" cellSpacing="0" border="0">
        <thead className="tbl-header">
          <tr>
          <th onClick={() => this.sortBy('stock_id')} >종목</th>
          <th onClick={() => this.sortBy('market_capitalization')}>시가총액</th>
          <th onClick={() => this.sortBy('per')}>PER</th>
          <th onClick={() => this.sortBy('dividend_rate')}>배당금</th>
          <th onClick={() => this.sortBy('roe_trends')}>ROE</th>
          </tr>
        </thead>
        <tbody className="tbl-content">
          {rows}
        </tbody>
      </table>
    );
    
  }
}


export default Table;