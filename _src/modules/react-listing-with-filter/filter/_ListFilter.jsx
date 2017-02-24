class ListFilter extends React.Component {
  filterDropdown = () => {
    if(this.props.data.filters === undefined) {
      return;
    }

    return (
      this.props.data.filters.map((filter, index) => {
        return (
          <FilterGroup
            key = { index }
            filter = { filter }
            selectedFilters = {this.props.selectedFilters}
            onClickFilter = {this.props.onClickFilter}
          />
        )
      })
    );
  }

  filterLength() {
    if(this.props.data.filters === undefined) {
      return;
    }

    if(this.props.data.options.keywordLookUp === undefined) {
      return this.props.data.filters.length
    }

    return this.props.data.filters.length + 1;
  }

  keywordSearch = () => {
    if(this.props.data.options.keywordLookUp === undefined || this.props.data.options.keywordPlaceholder === undefined) {
      return;
    }

    return (
      <div className="filter-group">
        <label
          for="react-search-keyword"
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

  render() {
    return (
      <div className={`filter-con col-${this.filterLength()}`}>
        {this.filterDropdown()}

        {this.keywordSearch()}
      </div>
    );
  }
}
