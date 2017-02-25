class TextImagePanel extends React.Component {

  getPanelType = () => {
    return this.props.data.options.panelType === "vertical" || this.props.data.options.panelType === "overlay" ? "vertical" : "";
  }

  render() {
    return (
      <div className={`text-image-panel ${this.getPanelType()}`}>
        {this.props.data.items.map((item, index) => {
          if(this.props.data.panelType === 'thumbnail') {
            return (
              <TextImageItemThumbnail
              key = { index }
              item = { item }
              data = { this.props.data }
              />
            );
          } else {
            return (
              <TextImageItem
              key = { index }
              item = { item }
              data = { this.props.data }
              />
            );
          }
        })}
      </div>
    );
  }
}
