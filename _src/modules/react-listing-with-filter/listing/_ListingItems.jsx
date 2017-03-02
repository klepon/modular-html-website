class ListingItems extends React.Component {
  getPanelType = () => {
    return this.props.data.options.panelType === "vertical" || this.props.data.options.panelType === "overlay" ? "vertical" : "";
  }

  isPassFilter = (item) => {
    if(isEmpty(this.props.selectedFilters)) {
      return true;
    }

    let lookup, filter, value, match = 0, total = 0;

    for ( lookup in this.props.selectedFilters ) {
      if ( this.props.selectedFilters.hasOwnProperty( lookup ) ) {
        total = total + 1;

        if( typeof( item[lookup] ) === "number" ) {
          if( this.props.selectedFilters[ lookup ].indexOf(item[ lookup ]) !== -1 ) {
            match = match + 1;
          }
        } else {
          for( value in item[ lookup ] ) {
            if( this.props.selectedFilters[ lookup ].indexOf( item[ lookup ][ value ] ) !== -1 ) {
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
    if(this.props.keyword === "") {
      return true;
    }

    let found = false;

    this.props.data.options.keywordLookUp.map((lookup) => {
      if( item[lookup].toLowerCase().indexOf(this.props.keyword) > -1) {
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

      this.props.data.items.map((item, index) => {
        if(!this.isPassFilter(item) || !this.isPassKeyword(item)) {
          return;
        }

        listing++;
      });

      return listing;
    }

  sortListing = (listing) => {
    if( this.props.data.sorts[ this.props.sort ] === undefined ) {
      return listing;
    }

    if( this.props.data.sorts[ this.props.sort ].lookup === undefined ) {
      return listing;
    }

    // sort asc
    listing.sort((aa, bb) => {
      let a, b;

      if( this.props.data.sorts[ this.props.sort ].reff === undefined ) {
        // special for price aa
        if(this.props.data.sorts[ this.props.sort ].lookup === 'price' && aa.discount !== undefined) {
          a = ""+(aa[this.props.data.sorts[ this.props.sort ].lookup] - (aa[this.props.data.sorts[ this.props.sort ].lookup] * aa.discount / 100));
        } else {
          a = aa[this.props.data.sorts[ this.props.sort ].lookup];
        }

        // special for price bb
        if(this.props.data.sorts[ this.props.sort ].lookup === 'price' && bb.discount !== undefined) {
          b = ""+(bb[this.props.data.sorts[ this.props.sort ].lookup] - (bb[this.props.data.sorts[ this.props.sort ].lookup] * bb.discount / 100));
        } else {
          b = bb[this.props.data.sorts[ this.props.sort ].lookup];
        }
      } else {
        a = this.props.data[this.props.data.sorts[ this.props.sort ].reff][aa[this.props.data.sorts[ this.props.sort ].lookup]][0];
        b = this.props.data[this.props.data.sorts[ this.props.sort ].reff][bb[this.props.data.sorts[ this.props.sort ].lookup]][0];
      }

      if(this.props.data.sorts[ this.props.sort ].order === 'asc') {
        return a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'}); // asc
      } else {
        return b.localeCompare(a, undefined, {numeric: true, sensitivity: 'base'}); // desc
      }
    })

    return listing;
  }

  renderListing = () => {
    let even = true,
      last = false,
      listing = [],
      i = 0,
      items = this.sortListing(this.props.data.items),
      n = items.length;

    for(i; i < n; i++) {
      if(!this.isPassFilter(items[i]) || !this.isPassKeyword(items[i])) {
        continue;
      }

      // limit perpage
      if(i === this.props.data.options.perPage) {
        break;
      }

      even = even === true ? false : true;

      if(i === items.length - 1) {
        last = true;
      }

      if(this.props.data.panelType === 'thumbnail') {
        listing.push(
          <TextImageItemThumbnail
          key = { i }
          even = { even }
          last = { last }
          item = { items[i] }
          data = { this.props.data }
          />
        );
      } else {
        listing.push(
          <TextImageItem
          key = { i }
          even = { even }
          last = { last }
          item = { items[i] }
          data = { this.props.data }
          />
        );
      }
    }

    if(listing.length === 0) {
      listing.push(<p key="0">{this.props.data.options.noResultMessage}</p>)
    }

    return listing;
  }

  renderSort = () => {
    let key, sorts = [];

    for(key in this.props.data.sorts) {
      sorts.push(
        <option key={key} value={key}>{this.props.data.sorts[key].name}</option>
      );
    }
    return (
      <select onChange={this.props.onChangeSort} value={this.props.sort}>
        {sorts}
      </select>
    );
  }

  render() {
    return (
      <div className="listing-con">
        <div className="meta-sort">
          <p>showing {
            this.props.page * this.props.data.options.perPage - this.props.data.options.perPage + 1
            } - {
            Math.min(this.props.page * this.props.data.options.perPage, this.countTotal())
            } from {
            this.countTotal()
          }</p>

          { this.renderSort() }
        </div>

        <div className={`text-image-panel ${this.getPanelType()}`}>
          {this.renderListing()}
        </div>
      </div>
    );
  }
}
