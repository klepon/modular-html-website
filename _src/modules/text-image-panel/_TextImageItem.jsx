/*
* reverse: will reverse flex order
* vertical: set true for vertical image text
* overlay: set true to show text overlay on hover image, automatic vertical true, reverse false, background null
* thumbnail: square bg image for side panel
* background: detail background-color
* title: h2 title
* link: target link
* smallTitle: set true to use small title
* subTitle: subtitle text
* subTitleLink: sub title target link
* text: description text, text area non rich text
* buttonText: text on cta button, use same link as title
* buttonLink: button link target, will use link as default if buttonLink not set
* footer: display footer item with price, discount, rating, button
* price: product price, automaticaly set line trough if discount exist
* discPrice: product price after discount
* discount: discount text ie: 0% off
* rating: product rating 0 - 5, increament 0.5
*/

class TextImageItem extends React.Component {
  isExist(data) {
    if(data === undefined || data === "") {
      return false;
    }

    return true;
  }

  getReverse = () => {
    return this.props.data.options.panelReverse === "reverse" ? "reverse" : "";
  }

  getVertical = () => {
    return this.props.data.options.panelType === "vertical" ? "" : "col-50";
  }

  getPadded = () => {
    return !this.isExist(this.props.item.background) ? "" : "padded";
  }

  getBackground = () => {
    return !this.isExist(this.props.item.background) ? {}
      : { 'background-color': this.props.item.background };
  }

  getUseFooter = () => {
    return (this.isExist(this.props.item.price) || this.isExist(this.props.item.rating)) ? "item-footer" : "";
  }

  getDiscount = () => {
    if( this.isExist(this.props.item.discount) ) {
      return "through";
    }
  }

  getTitle = () => {
    if( !this.isExist(this.props.item.title) ) {
      return null;
    }

    if( this.isExist(this.props.item.detailUrl) ) {
      return (
        <h2 className="small">
            <a href = { this.props.item.detailUrl }
              title={ this.props.item.title }>
              { this.props.item.title }
            </a>
        </h2>
      )
    } else {
      return (
        <h2 className="small">
          { this.props.item.title }
        </h2>
      )
    }
  }

  getCategory = () => {
    if(!this.isExist(this.props.item.category)) {
      return null;
    }

    if(this.isExist(this.props.data.categories[this.props.item.category])) {
      return (
        <p className="small">
          <a href={ this.props.data.categories[this.props.item.category][1] }
            title={ this.props.data.categories[this.props.item.category][0] }>
            { this.props.data.categories[this.props.item.category][0] }
          </a>
        </p>
      )
    } else {
      return (
        <p className="small">
          { this.props.data.categories[this.props.item.category][0] }
        </p>
      )
    }
  }

  getDescription = () => {
    return !this.isExist(this.props.item.description) ? "" : this.props.item.description;
  }

  getPrice = () => {
    if( this.isExist(this.props.item.price) ) {
      return (
        <span className="price">
          { this.getDiscountPrice() }

          <span className={ this.getDiscount() }>{ this.props.data.options.currency } { this.props.item.price }</span>
        </span>
      )
    }
  }

  getDiscountPrice = () => {
    if( this.isExist(this.props.item.discount) ) {
      return (
        <span>{ this.props.data.options.currency } {this.props.item.price - ( this.props.item.price * this.props.item.discount / 100 )}</span>
      )
    }
  }

  getRating = () => {
    if( this.isExist(this.props.item.rating) ) {
      return (
        <span className="rating">
          <span style="width:calc(100% * { this.props.item.rating } / 5)">&nbsp;</span>
        </span>
      )
    }
  }

  getDiscountAndRating = () => {
    if( this.isExist(this.props.item.discount) ) {
      return (
        <span className="discount">
          <span className="discount-text">{ this.props.item.discount }</span>
          { this.getRating() }
        </span>
      )
    }

    return this.getRating();
  }

  getCTALink = () => {
    return this.isExist(this.props.item.ctaLink)
      ? this.props.item.ctaLink
      : ( this.isExist(this.props.item.detailUrl) ? this.isExist(this.props.item.detailUrl) : "#" );
  }

  getCTA = () => {
    if( this.isExist(this.props.item.ctaText) ) {
      <a href="{ this.getCTALink() }" title="{ this.props.item.ctaText }" className="btn">{ this.props.item.ctaText }</a>
    }
  }

  getFooter = () => {
    <p className={ this.getUseFooter() }>
      { this.getPrice() }

      { this.getDiscountAndRating() }

      { this.getCTA() }
    </p>
  }

  render() {
    return (
      <div className = {` row ${ this.getReverse() } `}>
        <div className = {` thumbnail-container ${ this.getVertical() } `}>
          <div className="thumbnail" style="background-image:url({ this.props.item.thumbnail })">&nbsp;</div>
        </div>

        <div className = {` detail ${ this.getVertical() } ${ this.getPadded() } `}
          style={ this.getBackground() }>

          { this.getTitle() }

          { this.getCategory() }

          { this.getDescription() }

          { this.getFooter() }
        </div>
      </div>
    );
  }
}
