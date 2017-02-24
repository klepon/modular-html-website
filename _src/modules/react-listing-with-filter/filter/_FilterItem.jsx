class FilterItem extends React.Component {
  isChecked = () => {
    if(this.props.selectedFilters[this.props.lookup] === undefined && this.props.option.id === -1) {
      return "checked";
    }

    if(this.props.selectedFilters[this.props.lookup] !== undefined && this.props.selectedFilters[this.props.lookup].indexOf(this.props.option.id) > -1) {
      return "checked";
    }
  }

  render() {
    return (
      <span className={`filter-item ${this.isChecked()}`}
        onClick={(e) => this.props.onClickFilter(e, this.props.lookup, this.props.option.id)}>
        <Icon icon="tick" />
        {this.props.option.displayText}
      </span>
    );
  }
}
