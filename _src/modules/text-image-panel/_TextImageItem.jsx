class TextImageItem extends React.Component {
  isExist(data, isTrue) {
    if(data === undefined || data === "") {
      return false;
    }

    if(isTrue !== undefined) {
      return data;
    }

    return true;
  }

  getReverse = () => {
    return this.props.data.options.panelReverse === "reverse" ? "reverse" : "";
  }

  getRowSpacer = () => {
    return this.props.data.options.panelType === "vertical" ? "" : "";
  }

  getOverlay = () => {
    return this.props.data.options.panelType === "overlay"
      ? (this.isExist(this.props.item.background) ? "shadow-hover overlay" : "overlay")
      : (this.isExist(this.props.item.background) ? "shadow-hover" : "");
  }

  getThumbnail = () => {
    return this.props.data.options.panelType === "thumbnail" ? "with-thumbnail" : "";
  }

  getItemType = (colOne) => {
    return this.props.data.options.panelType === "vertical"
      ? ""
      : (this.props.data.options.panelType === "thumbnail"
        ? (colOne ? "col-one" : "col-two")
        : (this.props.data.options.panelType === "overlay"
          ? "" : "col-50"));
  }

  getDetailPadded = () => {
    return !this.isExist(this.props.item.background) ? "" : "padded";
  }

  getBackground = () => {
    return !this.isExist(this.props.item.background) ? "" : this.props.item.background;
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
        <h2 className = {this.isExist(this.props.data.options.smallTitle, true) ? "small" : ""}>
            <a href = { this.props.item.detailUrl }
              title={ this.props.item.title }>
              { this.props.item.title }
            </a>
        </h2>
      )
    } else {
      return (
        <h2 className = {this.isExist(this.props.data.options.smallTitle) ? "small" : ""}>
          { this.props.item.title }
        </h2>
      )
    }
  }

  getTags = () => {
    if(!this.isExist(this.props.item.tagIDs)) {
      return null;
    }

    this.props.item.tagIDs.sort();

    return (
      <span>
        {this.props.item.tagIDs.map((tag, index) => {
          if(this.isExist(this.props.data.tags[tag])) {
            return (
              <span key = { index }>,&nbsp;
                <a href={ this.props.data.tags[tag][1] }
                  title={ this.props.data.tags[tag][0] }>
                  { this.props.data.tags[tag][0] }
                </a>
              </span>
            );
          }
        })}
      </span>
    );
  }

  getCategory = () => {
    if(!this.isExist(this.props.item.categoryID)) {
      return null;
    }

    if(this.isExist(this.props.data.categories[this.props.item.categoryID])) {
      return (
        <p className="small">
          <a href={ this.props.data.categories[this.props.item.categoryID][1] }
            title={ this.props.data.categories[this.props.item.categoryID][0] }>
            { this.props.data.categories[this.props.item.categoryID][0] }
          </a>

          { this.getTags() }
        </p>
      )
    }
  }

  getDescription = () => {
    if( this.isExist(this.props.item.description) ) {
      return (
        <p>{ this.props.item.description }</p>
      )
    }
  }

  getPrice = () => {
    if( this.isExist(this.props.item.price) ) {
      return (
        <span className="price">
          { this.getDiscountPrice() }

          <span
            className={ this.getDiscount() }>
            <FormatMoney
              currency = { this.props.data.options.currency }
              value = { this.props.item.price }
            />
          </span>
        </span>
      )
    }
  }

  getDiscountPrice = () => {
    if( this.isExist(this.props.item.discount) ) {
      return (
        <FormatMoney
          currency = { this.props.data.options.currency }
          value = { this.props.item.price - ( this.props.item.price * this.props.item.discount / 100 ) }
        />
      );
    }
  }

  getRating = () => {
    if( this.isExist(this.props.item.rating) ) {
      return (
        <span className="rating" style = {{width: "calc(20px * "+ this.props.item.rating +")"}}>
          <Icon icon = "star" />
          <Icon icon = "star" />
          <Icon icon = "star" />
          <Icon icon = "star" />
          <Icon icon = "star" />
        </span>
      )
    }
  }

  getDiscountAndRating = () => {
    if( this.isExist(this.props.item.discount) ) {
      return (
        <span className="discount">
          <span className="discount-text">{ this.props.item.discount }{ this.props.data.options.discountSuffix}</span>
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
      return (
        <a href="{ this.getCTALink() }" title="{ this.props.item.ctaText }" className="btn">{ this.props.item.ctaText }</a>
      )
    }
  }

  getFooter = () => {
    return (
      <p className={ this.getUseFooter() }>
      { this.getPrice() }

      { this.getDiscountAndRating() }

      { this.getCTA() }
      </p>
    );
  }

  getThumbnailCon = () => {
    return (
      <div className = {` thumbnail-container ${ this.getItemType(true) } `}>
        <div className="thumbnail" style = {{backgroundImage : "url("+ this.props.item.thumbnail +")"}}>&nbsp;</div>
      </div>
    );
  }

  getDetailCon = () => {
    return (
      <div className = {` detail ${ this.getItemType() } ${ this.getDetailPadded() } `}
        style = {{backgroundColor: this.getBackground()}}>

        { this.getTitle() }

        { this.getCategory() }

        { this.getDescription() }

        { this.getFooter() }
      </div>
    );
  }

  getEvenOdd = () => {
    if(this.props.data.options.panelType === "even-odd") {
      let last = this.props.last ? "" : "no-spacer-bottom";

      return this.props.data.options.panelType === "even-odd" && this.props.even ? last + " reverse" : last;
    }

    return "";
  }

  render() {
    if(this.props.data.options.panelType === "overlay" && this.isExist(this.props.item.detailUrl)) {
      return (
        <a className = {`row ${ this.getReverse() }  ${ this.getRowSpacer() } ${ this.getOverlay() } ${ this.getThumbnail() } ${ this.getEvenOdd() }`}
          href = {this.props.item.detailUrl}>
          { this.getThumbnailCon() }
          { this.getDetailCon() }
        </a>
      );
    } else {
      return (
        <div className = {`row ${ this.getReverse() }  ${ this.getRowSpacer() } ${ this.getOverlay() } ${ this.getThumbnail() } ${ this.getEvenOdd() }`}>
          { this.getThumbnailCon() }
          { this.getDetailCon() }
        </div>
      );
    }
  }
}
