class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: "",
      data: props.data,
      selectedFilters: {},
      keyword: ""
    }

    this.onClickFilter = this.onClickFilter.bind(this);
    this.onChangeKeyword = this.onChangeKeyword.bind(this);
  }

  onClickFilter(e, lookup, val) {
    // first time lookup use
    if(this.state.selectedFilters[lookup] === undefined) {
      this.state.selectedFilters[lookup] = [];
    }

    // update lookup array
    this.state.selectedFilters[lookup].push(val);

    // remove lookup if all selected
    if(val === -1) {
      delete this.state.selectedFilters[lookup];
    }

    // update state
    this.setState({
      selectedFilters: this.state.selectedFilters
    });
  }

  onChangeKeyword(e) {
    this.setState({
      keyword: e.target.value
    })
  }

  render() {
    return (
      <div>
        <strong>next: </strong>
        <ul>
          <li>render all item</li>
          <li>render item by filter</li>
          <li>render item by keyword</li>
        </ul>

        <ListFilter
          data = {this.state.data}
          selectedFilters = {this.state.selectedFilters}
          keyword = {this.state.keyword}
          onClickFilter = {this.onClickFilter}
          onChangeKeyword = {this.onChangeKeyword}
        />

        <TextImagePanel
          data = {this.state.data}
          selectedFilters = {this.state.selectedFilters}
          keyword = {this.state.keyword}
        />

        pagination
      </div>
    );
  }
}

$(function(){
  if($('#react-app').length > 0 && $('#json-text-data').length > 0) {
    let data = JSON.parse($('#json-text-data').text());

    ReactDOM.render(
    <App data={data}/>,
    document.getElementById('react-app')
    );
  }
});
