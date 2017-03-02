class ListFilter extends React.Component {
  filterDropdown = () => {
    if(this.props.data.filters === undefined) {
      return;
    }

    let lookup, index = 0, filters = [];

    for( lookup in this.props.data.filters) {
      filters.push (
        <FilterGroup
          key = { index }
          lookup = { lookup }
          filter = { this.props.data.filters[lookup] }
          selectedFilters = { this.props.selectedFilters }
          onClickFilter = { this.props.onClickFilter }
        />
      );

      index++;
    }

    return filters;
  }

  filterLength() {
    if(this.props.data.filters === undefined) {
      return;
    }

    if(this.props.data.options.keywordLookUp === undefined) {
      return Object.size(this.props.data.filters);
    }

    return Object.size(this.props.data.filters) + 1;
  }

  keywordSearch = () => {
    if(this.props.data.options.keywordLookUp === undefined || this.props.data.options.keywordPlaceholder === undefined) {
      return;
    }

    return (
      <div className="filter-group">
        <label
          htmlFor="react-search-keyword"
          className="sr-only">{this.props.data.options.keywordPlaceholder}</label>
        <input
          id="react-search-keyword"
          type="text"
          value={this.props.keyword}
          placeholder={this.props.data.options.keywordPlaceholder}
          onChange={(e) => this.props.onChangeKeyword(e)} />
      </div>
    )
  }

  selectedFilters = () => {
    if(isEmpty(this.props.selectedFilters)) {
      return null;
    }

    return (
      <div className="selected-filter">
        { this.getSelectedFilter() }
      </div>
    );
  }

  getSelectedFilter = () => {
    let lookup, index = 0, filters = [];
    for ( lookup in this.props.data.filters ) {
      if( this.props.selectedFilters[lookup] !== undefined ) {
        this.props.selectedFilters[lookup].map((filterId) => {
          let copyLookup = lookup; // make sure it use current lookup, not reference
          filters.push (
            <button className="selected-item white" key={index}
              onClick={(e) => this.props.onClickFilter(e, copyLookup, filterId)}>
              <span>{this.props.data.filters[lookup].options[filterId]}</span>
              <Icon icon="cross" />
            </button>
          );

          index++;
        });

        filters.push(<span key={lookup} className="separator" />);
      }
    }

    return filters;
  }

  render() {
    return (
      <div className={`filter-section`}>
        <div className={`filter-con col-${this.filterLength()}`}>
          { this.filterDropdown() }

          { this.keywordSearch() }
        </div>

        { this.selectedFilters() }
      </div>
    );
  }
}
