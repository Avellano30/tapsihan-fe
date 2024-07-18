import { useState, useEffect } from "react";
import {
  SimpleGrid,
  Button,
  Select,
  Table,
  Modal,
  Image,
  TextInput,
  Textarea,
  NumberInput,
  FileInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil, IconPlus, IconSearch, IconTrashX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { endpoint } from "../main";

// Define the Product interface
interface Product {
  _id: string;
  productName: string;
  description: string;
  price: number;
  stocks: number;
  image: string; // URL or path to the image
}

// Define the new product interface for adding
interface NewProduct {
  productName: string;
  description: string;
  price: number;
  stocks: number;
  image?: File;
}

// Main Products component
export default function Products() {
  // State to handle products, new product input, and modals
  const [searchValue, setSearchValue] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    productName: "",
    description: "",
    price: 0,
    stocks: 0,
    image: undefined,
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [validationError, setValidationError] = useState<string>("");

  // Disclosure hooks for modals
  const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  // Get all Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${endpoint}/products`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle input change for both new product and selected product for editing
  const handleInputChange = (field: keyof Product | keyof NewProduct, value: string | number | File) => {
    if (selectedProduct) {
      setSelectedProduct({ ...selectedProduct, [field]: value });
    } else {
      setNewProduct({ ...newProduct, [field]: value });
    }
    setValidationError("");
  };

  // Validate new product form fields
  const validateNewProduct = (): boolean => {
    if (!newProduct.productName) {
      setValidationError("Product Name is required");
      return false;
    }
    if (!newProduct.description) {
      setValidationError("Product Description is required");
      return false;
    }
    if (newProduct.price < 50) {
      setValidationError("Product Price must be at least 50");
      return false;
    }
    if (newProduct.stocks <= 0) {
      setValidationError("Product Stocks must be greater than zero");
      return false;
    }
    if (!newProduct.image) {
      setValidationError("Product Image is required");
      return false;
    }
    return true;
  };

  // Validate selected product form fields for editing
  const validateSelectedProduct = (): boolean => {
    if (!selectedProduct) return false;
    if (!selectedProduct.productName) {
      setValidationError("Product Name is required");
      return false;
    }
    if (!selectedProduct.description) {
      setValidationError("Product Description is required");
      return false;
    }
    if (selectedProduct.price < 50) {
      setValidationError("Product Price must be at least 50");
      return false;
    }
    if (selectedProduct.stocks <= 0) {
      setValidationError("Product Stocks must be greater than zero");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (validationError) {
      notifications.show({
        title: "Required Field",
        message: validationError,
        color: "red",
        autoClose: 5000,
        position: "top-right",
        onClose: () => setValidationError(""),
      });
    }
  }, [validationError]);

  // Add Product
  const handleFormSubmit = async () => {
    if (!validateNewProduct()) return;

    const formData = new FormData();
    formData.append("productName", newProduct.productName);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price.toString());
    formData.append("stocks", newProduct.stocks.toString());
    if (newProduct.image) {
      formData.append("image", newProduct.image);
    }
    try {
      const response = await fetch(`${endpoint}/products`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error creating product");
      }

      const createdProduct: Product = await response.json();
      setProducts((prevProducts) => [...prevProducts, createdProduct]);
      closeAddModal();
      setNewProduct({ productName: "", description: "", price: 0, stocks: 0, image: undefined });
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  // Update product
  const handleEditFormSubmit = async () => {
    if (!validateSelectedProduct() || !selectedProduct) return;

    const formData = new FormData();
    formData.append("productName", selectedProduct.productName);
    formData.append("description", selectedProduct.description);
    formData.append("price", selectedProduct.price.toString());
    formData.append("stocks", selectedProduct.stocks.toString());
    if (selectedProduct.image) {
      formData.append("image", selectedProduct.image);
    }

    try {
      const response = await fetch(`${endpoint}/products/${selectedProduct._id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error updating product");
      }

      const updatedProduct: Product = await response.json();
      setProducts((prevProducts) =>
        prevProducts.map((product) => (product._id === updatedProduct._id ? updatedProduct : product))
      );
      closeEditModal();
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Delete Product
  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`${endpoint}/products/${productToDelete._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error deleting product");
      }

      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productToDelete._id));
      closeDeleteModal();
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const filterProducts = products.filter((product) =>
    product.productName?.toLowerCase().includes(searchValue.toLowerCase()));

  // Render product rows in the table
  const rows = filterProducts.map((product) => (
    <Table.Tr key={product._id}>
      <Table.Td ta={"center"}>{product.stocks}</Table.Td>
      <Table.Td><Image src={product.image} w={200} h={"auto"} /></Table.Td>
      <Table.Td>{product.productName}</Table.Td>
      <Table.Td>{product.description}</Table.Td>
      <Table.Td ta={"center"}>₱{product.price.toLocaleString()}</Table.Td>
      <Table.Td ta={"center"}>
        <Button
          w={"100%"} color="#495057"
          leftSection={<IconPencil />}
          onClick={() => {
            setSelectedProduct(product);
            openEditModal();
          }}
        >
          Edit
        </Button>
        <Button
          mt={5} w={"100%"} color="#f03e3e"
          leftSection={<IconTrashX />}
          onClick={() => {
            setProductToDelete(product);
            openDeleteModal();
          }}
        >
          Delete
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <SimpleGrid
        cols={{ base: 1, sm: 1 }}
        spacing={{ base: "xs", sm: "xs" }}
        verticalSpacing={{ base: "xs", sm: "xs" }}
        mb={"md"}
      >
        <div className="flex justify-between items-center bg-[#940e0e1a] text-[#940e0e] font-bold rounded-md p-2">
          Products
          <Select
            variant="filled"
            checkIconPosition="right"
            w={{ base: "100%", sm: "250px" }}
            radius={"md"}
            data={products.map((product) => ({ value: product.productName, label: product.productName }))}
            rightSection={searchValue ? "" : <IconSearch size={15} />}
            placeholder="Search"
            clearable
            searchable
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            nothingFoundMessage="Nothing found..."
            comboboxProps={{ transitionProps: { transition: "pop", duration: 200 }, shadow: "md" }}
          />
        </div>
      </SimpleGrid>

      <div className="mb-4">
        <Button color="#940e0e" radius="md" onClick={openAddModal} w={{ base: "100%", md: "140px" }}>
          New Product <IconPlus size={15} stroke={3} className="ml-2" />
        </Button>
      </div>

      <div className="border-2 rounded-md border-[#940e0e]">
        <Table highlightOnHover withColumnBorders>
          <Table.Thead>
            <Table.Tr bg={"#940e0e1a"}>
              <Table.Th w={80} ta={"center"}>Stocks</Table.Th>
              <Table.Th w={200}>Product Image</Table.Th>
              <Table.Th>Product Name</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th w={150} ta={"center"}>Price</Table.Th>
              <Table.Th w={80} ta={"center"}>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </div>

      {/* Add Product Modal */}
      <Modal.Root opened={addModalOpened} onClose={closeAddModal} centered>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header bg={"#940e0e"} >
            <Modal.Title c={"white"} fw={"bold"}>Create New Product</Modal.Title>
            <Modal.CloseButton c={"white"} bg={"transparent"} />
          </Modal.Header>
          <Modal.Body>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: 15 }}>
              <TextInput
                radius="md"
                label="Product Name"
                placeholder="Enter Product Name"
                value={newProduct.productName}
                onChange={(e) => handleInputChange("productName", e.currentTarget.value)}
                withAsterisk
                required
              />

              <Textarea
                radius="md"
                label="Product Description"
                withAsterisk
                placeholder="Write a brief description of the product"
                value={newProduct.description}
                onChange={(e) => handleInputChange("description", e.currentTarget.value)}
                required
              />

              <NumberInput
                label="Product Price"
                placeholder="Enter Product Price"
                allowNegative={false}
                value={newProduct.price}
                onChange={(value) => handleInputChange("price", value ?? 0)}
                stepHoldDelay={500}
                stepHoldInterval={100}
                withAsterisk
                required
              />

              <NumberInput
                label="Product Stocks"
                placeholder="Enter Product Stocks"
                allowNegative={false}
                value={newProduct.stocks}
                onChange={(value) => handleInputChange("stocks", value ?? 0)}
                stepHoldDelay={500}
                stepHoldInterval={100}
                withAsterisk
                required
              />

              <FileInput
                variant="filled"
                label="Product Image"
                placeholder="Upload Product Image"
                accept="image/*"
                withAsterisk
                required
                onChange={(value) => handleInputChange("image", value as File)}
              />

              <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                <Button onClick={handleFormSubmit} variant="outline" color="#940e0e" bg={"#940e0e1a"}>
                  Create Product
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>

      {/* Edit Product Modal */}
      {selectedProduct && (
        <Modal.Root opened={editModalOpened} onClose={() => { setSelectedProduct(null); closeEditModal(); }} centered>
          <Modal.Overlay />
          <Modal.Content>
            <Modal.Header bg={"#940e0e"} >
              <Modal.Title c={"white"} fw={"bold"}>Edit Product</Modal.Title>
              <Modal.CloseButton c={"white"} bg={"transparent"} />
            </Modal.Header>
            <Modal.Body>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: 15 }}>
                <TextInput
                  radius="md"
                  label="Product Name"
                  placeholder="Enter Product Name"
                  value={selectedProduct.productName}
                  onChange={(e) => handleInputChange("productName", e.currentTarget.value)}
                  withAsterisk
                  required
                />

                <Textarea
                  radius="md"
                  label="Product Description"
                  withAsterisk
                  placeholder="Write a brief description of the product"
                  value={selectedProduct.description}
                  onChange={(e) => handleInputChange("description", e.currentTarget.value)}
                  required
                />

                <NumberInput
                  label="Product Price"
                  placeholder="Enter Product Price"
                  allowNegative={false}
                  value={selectedProduct.price}
                  onChange={(value) => handleInputChange("price", value ?? 0)}
                  stepHoldDelay={500}
                  stepHoldInterval={100}
                  withAsterisk
                  required
                />

                <NumberInput
                  label="Product Stocks"
                  placeholder="Enter Product Stocks"
                  allowNegative={false}
                  value={selectedProduct.stocks}
                  onChange={(value) => handleInputChange("stocks", value ?? 0)}
                  stepHoldDelay={500}
                  stepHoldInterval={100}
                  withAsterisk
                  required
                />

                <FileInput
                  variant="filled"
                  label="Product Image"
                  placeholder="Upload Product Image"
                  accept="image/*"
                  onChange={(value) => handleInputChange("image", value as File)}
                />

                <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                  <Button onClick={handleEditFormSubmit} variant="outline" color="#940e0e" bg={"#940e0e1a"}>
                    Update Product
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal.Content>
        </Modal.Root>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <Modal.Root opened={deleteModalOpened} onClose={() => { setProductToDelete(null); closeDeleteModal(); }} centered>
          <Modal.Overlay />
          <Modal.Content>
            <Modal.Header bg={"#940e0e"} >
              <Modal.Title c={"white"} fw={"bold"}>Delete Product</Modal.Title>
              <Modal.CloseButton c={"white"} bg={"transparent"} />
            </Modal.Header>
            <Modal.Body>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: 15 }}>
                <p>Are you sure you want to delete this product?</p>
                <h1>
                  <strong>{productToDelete.productName}</strong>
                </h1>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                  <Button onClick={handleDelete} variant="outline" color="#ff0000" bg={"#ff00001a"}>
                    Delete
                  </Button>
                  <Button onClick={closeDeleteModal} variant="outline" color="#000000" bg={"#0000001a"} ml="md">
                    Cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal.Content>
        </Modal.Root>
      )}

    </>
  );
}
