class FilterGroup extends React.Component {
  renderDropdown = () => {
    let id, options = [];
    for( id in this.props.filter.options ) {
      options.push(
        <FilterItem
          key = { id * 1}
          lookup = { this.props.lookup }
          id = { id * 1 }
          name = { this.props.filter.options[id] }
          selectedFilters = { this.props.selectedFilters }
          onClickFilter = { this.props.onClickFilter }
        />
      );
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
