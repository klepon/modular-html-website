class Icon extends React.Component {
  createMarkup() {
    return {__html: '<use xlink:href="#'+ this.props.icon +'"></use>'};
  };

  render() {
    return (
      <svg viewBox="0 0 100 100" className={`icon ${this.props.icon}`} dangerouslySetInnerHTML={this.createMarkup()} />
    );
  }
}
