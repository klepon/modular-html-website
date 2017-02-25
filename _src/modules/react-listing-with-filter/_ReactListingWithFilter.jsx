/*
*** data options:
* perPage: number of item to show per page/load [0 - 100]
* filterOnTop: set filter position ['top', 'left']
* panelType: panel type for listing item ['','thumbnail','vertical','overlay'], set overlay will only show item description
* panelReverse: set image bottom for vertical or right for horizontal ['', 'reverse']
* keywordPlaceholder: text to show as keyword placeholder
* keywordLookUp: any property of item data below, use to filter listing by keyword
* currency: will use as price currency ['USD', 'Rp', 'any string']
* discountSuffix: will use as discount suffix, ie: '% off'
* smallTitle: set true to use small font size, mostly for product panel

*** item data, all optional:
* title: item title
* detailUrl: target url for item title or button if ctaLink is not defined
* description: item description
* thumbnail: image path for item
* background: detail background color
* discount: discount without percentage, ie: 10, 15
* rating: start rating 0 - 5, 1.5 available
* categoryID: category id, must match with id on categories list and categories filter list
* price: product price, not thousand separator, decimal available
* priceRange: price filter, must match to one of the price id in price filter
* tagIDs: tags id in array, must match to tag id in tags list and tag filter list
* ctaText: text for item button, ie: read more, buy now
* ctaLink: product detail page, exclude this to use detailUrl

*** categories, tags list, filter see json data sample
*/
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
    ReactDOM.render(
    <App data={JSON.parse($('#json-text-data').text())}/>,
    document.getElementById('react-app')
    );
  }
});
