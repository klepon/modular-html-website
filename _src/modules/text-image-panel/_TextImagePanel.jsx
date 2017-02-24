class TextImagePanel extends React.Component {
  render() {
    return (
      <div className="text-image-panel {this.props.data.panelType}">
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
