class FilterGroup extends React.Component {
  render() {
    return (
      <div className="filter-group">
        <h3 className="title">{this.props.filter.name} <Icon icon="chevron-down" /></h3>
        <p className="filter-item-con">
          {this.props.filter.options.map((option, index) => {
            return (
              <FilterItem
                key = { index}
                lookup = { this.props.filter.lookup }
                option = { option }
                selectedFilters = {this.props.selectedFilters}
                onClickFilter = {this.props.onClickFilter}
              />
            );
          })}
        </p>
      </div>
    );
  }
}
