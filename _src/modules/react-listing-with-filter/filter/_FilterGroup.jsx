class FilterGroup extends React.Component {
  renderDropdown = () => {
    let id, index = 0, options = [];
    for( id in this.props.filter.options ) {
      options.push(
        <FilterItem
          key = { index}
          lookup = { this.props.lookup }
          id = { id * 1 }
          name = { this.props.filter.options[id] }
          selectedFilters = { this.props.selectedFilters }
          onClickFilter = { this.props.onClickFilter }
        />
      );

      index++;
    }

    return options;
  }

  render() {
    return (
      <div className="filter-group">
        <h3 className="title">{this.props.filter.name} <Icon icon="chevron-down" /></h3>
        <p className="filter-item-con">
          { this.renderDropdown() }
        </p>
      </div>
    );
  }
}
