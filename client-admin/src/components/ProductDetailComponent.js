import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: '',
      txtName: '',
      txtPrice: '',
      cmbCategory: '',
      imgProduct: '',
    };
  }

  render() {
    const cates = this.state.categories.map((cate) => {
      return (
        <option key={cate._id} value={cate._id}>
          {cate.name}
        </option>
      );
    });

    return (
      <div className="float-right">
        <h2 className="text-center">PRODUCT DETAIL</h2>
        <form>
          <table>
            <tbody>
              <tr>
                <td>ID</td>
                <td>
                  <input type="text" value={this.state.txtID} readOnly />
                </td>
              </tr>

              <tr>
                <td>Name</td>
                <td>
                  <input
                    type="text"
                    value={this.state.txtName}
                    onChange={(e) => this.setState({ txtName: e.target.value })}
                  />
                </td>
              </tr>

              <tr>
                <td>Price</td>
                <td>
                  <input
                    type="text"
                    value={this.state.txtPrice}
                    onChange={(e) => this.setState({ txtPrice: e.target.value })}
                  />
                </td>
              </tr>

              <tr>
                <td>Image</td>
                <td>
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/gif"
                    onChange={(e) => this.previewImage(e)}
                  />
                </td>
              </tr>

              <tr>
                <td>Category</td>
                <td>
                  <select
                    value={this.state.cmbCategory}
                    onChange={(e) =>
                      this.setState({ cmbCategory: e.target.value })
                    }
                  >
                    <option value="">-- Select category --</option>
                    {cates}
                  </select>
                </td>
              </tr>

              {/* ADD NEW */}
              <tr>
                <td></td>
                <td>
                  <input
                    type="submit"
                    value="ADD NEW"
                    onClick={(e) => this.btnAddClick(e)}
                  />
                </td>
              </tr>

              {/* ✅ UPDATE theo đề */}
              <tr>
                <td></td>
                <td>
                  <input
                    type="submit"
                    value="UPDATE"
                    onClick={(e) => this.btnUpdateClick(e)}
                  />
                </td>
              </tr>

              {/* ✅ DELETE theo đề */}
              <tr>
                <td></td>
                <td>
                  <input
                    type="submit"
                    value="DELETE"
                    onClick={(e) => this.btnDeleteClick(e)}
                  />
                </td>
              </tr>

              <tr>
                <td colSpan="2">
                  {this.state.imgProduct && (
                    <img
                      src={this.state.imgProduct}
                      width="300"
                      height="300"
                      alt=""
                    />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  componentDidUpdate(prevProps) {
    if (this.props.item && this.props.item !== prevProps.item) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name,
        txtPrice: this.props.item.price,
        cmbCategory: this.props.item.category._id,
        imgProduct: 'data:image/jpg;base64,' + this.props.item.image,
      });
    }
  }

  // ================= EVENT HANDLERS =================
  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(
      /^data:image\/[a-z]+;base64,/,
      ''
    );

    if (name && price && category && image) {
      const prod = { name, price, category, image };
      this.apiPostProduct(prod);
    } else {
      alert('Please input name and price and category and image');
    }
  }

  // ✅ UPDATE handler theo đề
  btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    console.log(id);
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(
      /^data:image\/[a-z]+;base64,/,
      ''
    ); // remove "data:image/...;base64,"

    if (id && name && price && category && image) {
      const prod = {id:id, name: name, price: price, category: category, image: image };
      this.apiPutProduct(id, prod);
    } else {
      alert('Please input id and name and price and category and image');
    }
  }

  // ✅ DELETE handler theo đề
  btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm('ARE YOU SURE ?')) {
      const id = this.state.txtID;
      if (id) {
        this.apiDeleteProduct(id);
      } else {
        alert('Please input id');
      }
    }
  }

  previewImage(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setState({ imgProduct: evt.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  // ================= APIS =================
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      this.setState({ categories: res.data });
    });
  }

  apiPostProduct(prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/products', prod, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('SUCCESS!');
        this.apiGetProducts();
      } else {
        alert('FAIL!');
      }
    });
  }

  // ✅ PUT API theo đề
  apiPutProduct(id, prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/products/' + id, prod, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY !');
        this.apiGetProducts();
      } else {
        alert('SORRY BABY !');
      }
    });
  }

  // ✅ DELETE API theo đề
  apiDeleteProduct(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/products/' + id, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY !');
        this.apiGetProducts();
      } else {
        alert('SORRY BABY !');
      }
    });
  }

  // ✅ apiGetProducts theo đề (updateProducts chỉ truyền 2 tham số đúng snippet)
  apiGetProducts() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .get('/api/admin/products?page=' + this.props.curPage, config)
      .then((res) => {
        const result = res.data;
        if (result.products.length !== 0) {
          this.props.updateProducts(result.products, result.noPages);
        } else {
          axios
            .get('/api/admin/products?page=' + (this.props.curPage - 1), config)
            .then((res) => {
              const result = res.data;
              this.props.updateProducts(result.products, result.noPages);
            });
        }
      });
  }
}

export default ProductDetail;
