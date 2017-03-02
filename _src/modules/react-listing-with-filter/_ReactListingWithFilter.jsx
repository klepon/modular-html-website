/*
*** data options:
* perPage: number of item to show per page/load [0 - 100]
* filterOnTop: set filter position ['top', 'left']
* panelType: panel type for listing item ['','thumbnail','vertical','overlay','even-odd'], set overlay will only show item description
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
      keyword: "",
      page: 1,
      sort: "default"
    }

    this.onClickFilter = this.onClickFilter.bind(this);
    this.onChangeKeyword = this.onChangeKeyword.bind(this);
    this.onChangeSort = this.onChangeSort.bind(this);
  }

  onClickFilter(e, lookup, val) {
    // first time lookup use
    if(this.state.selectedFilters[lookup] === undefined) {
      this.state.selectedFilters[lookup] = [];
    }

    // update lookup array
    let index = this.state.selectedFilters[lookup].indexOf(val);
    if(index === -1) {
      this.state.selectedFilters[lookup].push(val);
    } else {
      this.state.selectedFilters[lookup].splice(index, 1);

      // update val to 0 if none selected, let remove lookup handle the rest
      if(this.state.selectedFilters[lookup].length === 0) {
        val = 0;
      }
    }

    // remove lookup if all selected
    if(val === 0) {
      delete this.state.selectedFilters[lookup];
    }

    // update state
    this.setState({
      selectedFilters: this.state.selectedFilters
    });
  }

  onChangeKeyword(e) {
    this.setState({
      keyword: e.target.value.toLowerCase()
    })
  }

  onChangeSort(e){
    this.setState({sort: e.target.value});
  }


  isPassFilter = (item) => {
    if(isEmpty(this.state.selectedFilters)) {
      return true;
    }

    let lookup, filter, value, match = 0, total = 0;

    for ( lookup in this.state.selectedFilters ) {
      if ( this.state.selectedFilters.hasOwnProperty( lookup ) ) {
        total = total + 1;

        if( typeof( item[lookup] ) === "number" ) {
          if( this.state.selectedFilters[ lookup ].indexOf(item[ lookup ]) !== -1 ) {
            match = match + 1;
          }
        } else {
          for( value in item[ lookup ] ) {
            if( this.state.selectedFilters[ lookup ].indexOf( item[ lookup ][ value ] ) !== -1 ) {
              match = match + 1;
              break;
            }
          }
        }
      }
    }

    if(match === total) {
      return true;
    }

    return false;
  }

  isPassKeyword = (item) => {
    if(this.state.keyword === "") {
      return true;
    }

    let found = false;

    this.state.data.options.keywordLookUp.map((lookup) => {
      if( item[lookup].toLowerCase().indexOf(this.state.keyword) > -1) {
        found = true;
        return;
      }
    });

    if(found) {
      return true;
    }

    return false;
  }

  countTotal = () => {
    let listing = 0;

    this.state.data.items.map((item, index) => {
      if(!this.isPassFilter(item) || !this.isPassKeyword(item)) {
        return;
      }

      listing++;
    });

    return listing;
  }

  sortListing = (listing) => {
    if( this.state.data.sorts[ this.state.sort ] === undefined ) {
      return listing;
    }

    if( this.state.data.sorts[ this.state.sort ].lookup === undefined ) {
      return listing;
    }

    listing.sort((aa, bb) => {
      let a, b;

      if( this.state.data.sorts[ this.state.sort ].reff === undefined ) {
        // special for price aa
        if(this.state.data.sorts[ this.state.sort ].lookup === 'price' && aa.discount !== undefined) {
          a = ""+(aa[this.state.data.sorts[ this.state.sort ].lookup] - (aa[this.state.data.sorts[ this.state.sort ].lookup] * aa.discount / 100));
        } else {
          a = aa[this.state.data.sorts[ this.state.sort ].lookup];
        }

        // special for price bb
        if(this.state.data.sorts[ this.state.sort ].lookup === 'price' && bb.discount !== undefined) {
          b = ""+(bb[this.state.data.sorts[ this.state.sort ].lookup] - (bb[this.state.data.sorts[ this.state.sort ].lookup] * bb.discount / 100));
        } else {
          b = bb[this.state.data.sorts[ this.state.sort ].lookup];
        }
      } else {
        a = this.state.data[this.state.data.sorts[ this.state.sort ].reff][aa[this.state.data.sorts[ this.state.sort ].lookup]][0];
        b = this.state.data[this.state.data.sorts[ this.state.sort ].reff][bb[this.state.data.sorts[ this.state.sort ].lookup]][0];
      }

      if(this.state.data.sorts[ this.state.sort ].order === 'asc') {
        return a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'}); // asc
      } else {
        return b.localeCompare(a, undefined, {numeric: true, sensitivity: 'base'}); // desc
      }
    })

    return listing;
  }

  getValidItem = () => {
    let even = true,
      last = false,
      listing = [],
      i = 0,
      items = this.sortListing(this.state.data.items),
      n = items.length;

    for(i; i < n; i++) {
      if(!this.isPassFilter(items[i]) || !this.isPassKeyword(items[i])) {
        continue;
      }

      // limit perpage
      if(i === this.state.data.options.perPage) {
        break;
      }

      even = even === true ? false : true;

      if(i === items.length - 1) {
        last = true;
      }

      if(this.state.data.panelType === 'thumbnail') {
        listing.push(
          <TextImageItemThumbnail
          key = { i }
          even = { even }
          last = { last }
          item = { items[i] }
          data = { this.state.data }
          />
        );
      } else {
        listing.push(
          <TextImageItem
          key = { i }
          even = { even }
          last = { last }
          item = { items[i] }
          data = { this.state.data }
          />
        );
      }
    }

    if(listing.length === 0) {
      listing.push(<p key="0">{this.state.data.options.noResultMessage}</p>)
    }

    return listing;
  }

  render() {
    return (
      <div>


        <strong>next: </strong>
        <ul>
          <li>pagination</li>
          <li>show total</li>
        </ul>



        <ListFilter
          data = { this.state.data }
          page = { this.state.page }
          selectedFilters = { this.state.selectedFilters }
          keyword = { this.state.keyword }
          onClickFilter = { this.onClickFilter }
          onChangeKeyword = { this.onChangeKeyword }
        />

        <ListingItems
          items = { this.getValidItem() }
          onChangeSort = { this.onChangeSort }
          data = { this.state.data }
          page = { this.state.page }
          total = { this.countTotal() }
        />

        <Pagination
          data = { this.state.data }
          page = { this.state.page }
        />
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
