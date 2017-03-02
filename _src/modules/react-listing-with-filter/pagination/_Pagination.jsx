class Pagination extends React.Component {
  renderPagination = () => {
    if( this.props.total <= this.props.data.options.perPage ) {
      return;
    }

    let nav = [],
      disabled = "",
      active = "",
      i = 1,
      n = Math.ceil(this.props.total / this.props.data.options.perPage)
      ;

    disabled = this.props.page === 1 ? "disabled" : "";
    nav.push(<a onClick={(event) => this.props.updatePage(event, this.props.page - 1)} key="0" href="#" title="" className={`previous ${disabled}`}><Icon icon="chevron-left" /></a>);

    for(i; i <= n; i++) {
      active = i === this.props.page ? "active" : "";
      let pageLink = i;

      nav.push(
        <a onClick={(event) => this.props.updatePage(event, pageLink)} key={i} href="#" title="" className={active}>{i}</a>
      );
    }

    disabled = this.props.page === n ? "disabled" : "";
    nav.push(<a onClick={(event) => this.props.updatePage(event, this.props.page + 1)} key={this.props.total} href="#" title="" className={`next ${disabled}`}><Icon icon="chevron-right" /></a>);

    return nav;
  }

  render () {
    return (
      <div className="pagination">
        { this.renderPagination() }
      </div>
    );
  }
}
