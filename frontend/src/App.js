import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const API = "http://localhost:5000/products";

  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: ""
  });

  const [editId, setEditId] = useState(null);

  // Get all products
  const getProducts = async () => {
    try {
      const res = await axios.get(API);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Add or Update product
  const saveProduct = async () => {
    try {

      if (editId === null) {
        await axios.post(API, form);
      } else {
        await axios.put(`${API}/${editId}`, form);
        setEditId(null);
      }

      setForm({
        name: "",
        price: "",
        category: ""
      });

      getProducts();

    } catch (err) {
      console.log(err);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    await axios.delete(`${API}/${id}`);
    getProducts();
  };

  // Edit product
  const editProduct = (product) => {
    setEditId(product.id);

    setForm({
      name: product.name,
      price: product.price,
      category: product.category
    });
  };

  return (
    <div className="container">

      <h1>Product CRUD App</h1>

      <input
        type="text"
        placeholder="Product Name"
        name="name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        type="number"
        placeholder="Price"
        name="price"
        value={form.price}
        onChange={handleChange}
      />

      <input
        type="text"
        placeholder="Category"
        name="category"
        value={form.category}
        onChange={handleChange}
      />

      <button onClick={saveProduct}>
        {editId ? "Update Product" : "Add Product"}
      </button>

      <hr />

      <h2>Products</h2>

      {
        products.map((product) => (

          <div className="card" key={product.id}>

            <h3>{product.name}</h3>

            <p>Price : ₹{product.price}</p>

            <p>Category : {product.category}</p>

            <button onClick={() => editProduct(product)}>
              Update
            </button>

            <button
              className="delete"
              onClick={() => deleteProduct(product.id)}
            >
              Delete
            </button>

          </div>

        ))
      }

    </div>
  );
}

export default App;