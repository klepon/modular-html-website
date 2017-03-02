class FilterItem extends React.Component {
  isChecked = () => {
    if(this.props.selectedFilters[this.props.lookup] === undefined && this.props.id === 0) {
      return "checked";
    }

    if(this.props.selectedFilters[this.props.lookup] !== undefined && this.props.selectedFilters[this.props.lookup].indexOf(this.props.id) > -1) {
      return "checked";
    }
  }

  render() {
    return (
      <span className={`filter-item ${this.isChecked()}`}
        onClick={(e) => this.props.onClickFilter(e, this.props.lookup, this.props.id)}>
        <Icon icon="tick" />
        {this.props.name}
      </span>
    );
  }
}
