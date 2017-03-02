class ListingItems extends React.Component {
  getPanelType = () => {
    return this.props.data.options.panelType === "vertical" || this.props.data.options.panelType === "overlay" ? "vertical" : "";
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
            Math.min(this.props.page * this.props.data.options.perPage, this.props.total)
            } from {
            this.props.total
          }</p>

          { this.renderSort() }
        </div>

        <div className={`text-image-panel ${this.getPanelType()}`}>
          {this.props.items}
        </div>
      </div>
    );
  }
}
